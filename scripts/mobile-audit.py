#!/usr/bin/env python3
"""Auditoria mobile/desktop da Vitrine Base Showcase (Playwright).

Verifica: overflow horizontal, títulos cortados, WhatsApp escondido com menu aberto,
animações automáticas sem clique, canvas/WebGL no mobile, cards sobrepostos e
conteúdo coberto pela navegação fixa inferior. Gera evidências em screenshots/.

Uso: python3 scripts/mobile-audit.py [base_url]
"""
import asyncio
import os
import sys
from pathlib import Path

from playwright.async_api import async_playwright

BASE = sys.argv[1] if len(sys.argv) > 1 else "http://localhost:8080"
OUT = Path(os.environ.get("AUDIT_OUT", "/tmp/browser/mobile-audit/screenshots"))
OUT.mkdir(parents=True, exist_ok=True)

MOBILE_VIEWPORTS = [(392, 850), (360, 800), (430, 932)]
DESKTOP = (1440, 1800)
PAGES = [
    ("home", "/"),
    ("moda", "/demo/moda"),
    ("barbearia", "/demo/barbearia"),
    ("restaurante", "/demo/restaurante"),
    ("eletronicos", "/demo/eletronicos"),
]

failures: list[str] = []


def fail(msg: str):
    failures.append(msg)
    print("FAIL:", msg)


async def settle(page):
    await page.wait_for_timeout(1200)
    for frac in (0.25, 0.5, 0.75, 1.0):
        await page.evaluate(
            "f => window.scrollTo(0, document.body.scrollHeight * f)", frac
        )
        await page.wait_for_timeout(700)
    await page.evaluate("window.scrollTo(0, 0)")
    await page.wait_for_timeout(500)


async def check_overflow(page, label):
    data = await page.evaluate(
        """() => {
      const de = document.documentElement;
      const offenders = [];
      for (const el of document.querySelectorAll('body *')) {
        const r = el.getBoundingClientRect();
        if (r.width === 0 || r.height === 0) continue;
        const cs = getComputedStyle(el);
        if (cs.position === 'fixed' || cs.visibility === 'hidden' || cs.opacity === '0') continue;
        if (r.right > de.clientWidth + 2 || r.left < -2) {
          offenders.push(el.tagName + '.' + (el.className || '').toString().slice(0, 60));
        }
      }
      return { scrollW: de.scrollWidth, clientW: de.clientWidth, offenders: offenders.slice(0, 8) };
    }"""
    )
    if data["scrollW"] > data["clientW"] + 2:
        fail(f"{label}: overflow horizontal ({data['scrollW']} > {data['clientW']}) {data['offenders']}")


async def check_clipped_titles(page, label):
    clipped = await page.evaluate(
        """() => {
      const out = [];
      for (const el of document.querySelectorAll('h1,h2,h3')) {
        const r = el.getBoundingClientRect();
        if (r.width === 0 || r.height === 0) continue;
        const cs = getComputedStyle(el);
        if (cs.visibility === 'hidden' || cs.opacity === '0') continue;
        const de = document.documentElement;
        if (r.right > de.clientWidth + 2 || r.left < -2) {
          out.push((el.textContent || '').trim().slice(0, 40));
          continue;
        }
        if (el.scrollWidth > el.clientWidth + 2 && cs.overflow !== 'visible') {
          out.push((el.textContent || '').trim().slice(0, 40));
        }
      }
      return out.slice(0, 6);
    }"""
    )
    if clipped:
        fail(f"{label}: títulos cortados -> {clipped}")


async def check_animation_without_click(page, label):
    """Compara dois frames sem qualquer interação: algo precisa estar animando."""
    a = await page.screenshot()
    await page.wait_for_timeout(900)
    b = await page.screenshot()
    if a == b:
        fail(f"{label}: nenhuma animação automática detectada (frames idênticos sem clique)")


async def check_canvas(page, label):
    n = await page.evaluate(
        """() => [...document.querySelectorAll('canvas')].filter(c => c.clientWidth > 0 && c.clientHeight > 0).length"""
    )
    if n == 0:
        print(f"note: {label}: sem canvas visível nesta viewport inicial")
    return n


async def check_bottom_bar_coverage(page, label):
    """Conteúdo principal não pode ficar sob a barra fixa inferior."""
    covered = await page.evaluate(
        """() => {
      const bars = [...document.querySelectorAll('body *')].filter(el => {
        const cs = getComputedStyle(el);
        const r = el.getBoundingClientRect();
        return cs.position === 'fixed' && r.height > 0 && r.bottom > window.innerHeight - 8 && r.width > 80;
      });
      if (!bars.length) return null;
      const top = Math.min(...bars.map(b => b.getBoundingClientRect().top));
      const main = document.querySelector('main');
      if (!main) return null;
      const last = main.getBoundingClientRect().bottom;
      window.scrollTo(0, document.body.scrollHeight);
      return { barTop: top, docBottomGap: document.body.scrollHeight - window.scrollY - window.innerHeight, last };
    }"""
    )
    if covered is None:
        return
    await page.wait_for_timeout(300)
    hidden = await page.evaluate(
        """() => {
      const bars = [...document.querySelectorAll('body *')].filter(el => {
        const cs = getComputedStyle(el);
        const r = el.getBoundingClientRect();
        return cs.position === 'fixed' && r.height > 0 && r.bottom > window.innerHeight - 8 && r.width > 80;
      });
      if (!bars.length) return [];
      const barTop = Math.min(...bars.map(b => b.getBoundingClientRect().top));
      const out = [];
      for (const el of document.querySelectorAll('main a, main button, main h1, main h2, main p')) {
        const r = el.getBoundingClientRect();
        if (r.height === 0) continue;
        if (r.top < window.innerHeight && r.bottom > barTop + 4 && r.top > barTop - 4) {
          out.push(el.tagName + ':' + (el.textContent || '').trim().slice(0, 24));
        }
      }
      return out.slice(0, 5);
    }"""
    )
    if hidden:
        fail(f"{label}: conteúdo sob a barra fixa inferior -> {hidden}")


async def check_whatsapp_menu(page, label):
    fab = page.get_by_label("Falar no WhatsApp")
    if await fab.count() == 0:
        return
    menu = page.get_by_role("button", name="Menu")
    if await menu.count() == 0:
        return
    await menu.first.click()
    await page.wait_for_timeout(700)
    visible = await fab.first.is_visible()
    style = await fab.first.evaluate(
        "el => { const cs = getComputedStyle(el); return { op: cs.opacity, pe: cs.pointerEvents, hidden: el.getAttribute('aria-hidden') }; }"
    )
    if visible and float(style["op"]) > 0.05 and style["pe"] != "none":
        fail(f"{label}: WhatsApp continua visível/clicável com o menu aberto ({style})")
    await page.screenshot(path=str(OUT / f"{label}-menu-aberto.png"))
    close = page.get_by_label("Fechar menu")
    if await close.count():
        await close.first.click()
        await page.wait_for_timeout(700)
        if not await fab.first.is_visible():
            fail(f"{label}: WhatsApp não retornou após fechar o menu")


async def check_overlap(page, label):
    """Cards de produto/painéis não devem se sobrepor no fluxo normal."""
    overlaps = await page.evaluate(
        """() => {
      const cards = [...document.querySelectorAll('[data-card],article,li > a[href*="/produto/"]')].filter(el => {
        const r = el.getBoundingClientRect();
        const cs = getComputedStyle(el);
        return r.width > 80 && r.height > 80 && cs.position !== 'absolute' && cs.position !== 'fixed';
      });
      const out = [];
      for (let i = 0; i < cards.length; i++) {
        for (let j = i + 1; j < cards.length; j++) {
          const a = cards[i].getBoundingClientRect(), b = cards[j].getBoundingClientRect();
          if (cards[i].contains(cards[j]) || cards[j].contains(cards[i])) continue;
          const ox = Math.min(a.right, b.right) - Math.max(a.left, b.left);
          const oy = Math.min(a.bottom, b.bottom) - Math.max(a.top, b.top);
          if (ox > 12 && oy > 12) out.push([i, j, Math.round(ox), Math.round(oy)]);
        }
      }
      return out.slice(0, 5);
    }"""
    )
    if overlaps:
        fail(f"{label}: cards sobrepostos -> {overlaps}")


async def run():
    async with async_playwright() as p:
        browser = await p.chromium.launch(headless=True)
        for w, h in MOBILE_VIEWPORTS:
            ctx = await browser.new_context(
                viewport={"width": w, "height": h},
                is_mobile=True,
                has_touch=True,
                device_scale_factor=2,
            )
            page = await ctx.new_page()
            for name, path in PAGES:
                label = f"{name}-{w}x{h}"
                await page.goto(BASE + path, wait_until="domcontentloaded")
                await page.wait_for_timeout(1500)
                await check_animation_without_click(page, label)
                await check_canvas(page, label)
                await check_overflow(page, label)
                await check_clipped_titles(page, label)
                await check_overlap(page, label)
                await page.screenshot(path=str(OUT / f"{label}-topo.png"))
                await settle(page)
                await check_overflow(page, label + "-pos-scroll")
                await check_clipped_titles(page, label + "-pos-scroll")
                await check_overlap(page, label + "-pos-scroll")
                await page.screenshot(path=str(OUT / f"{label}-final.png"))
                if w == 392:
                    await check_bottom_bar_coverage(page, label)
                    if path != "/":
                        await check_whatsapp_menu(page, label)
            await ctx.close()

        ctx = await browser.new_context(viewport={"width": DESKTOP[0], "height": DESKTOP[1]})
        page = await ctx.new_page()
        for name, path in PAGES:
            label = f"{name}-desktop"
            await page.goto(BASE + path, wait_until="domcontentloaded")
            await page.wait_for_timeout(1500)
            await check_overflow(page, label)
            await check_clipped_titles(page, label)
            await page.screenshot(path=str(OUT / f"{label}-topo.png"))
            await settle(page)
            await check_overlap(page, label)
            await page.screenshot(path=str(OUT / f"{label}-final.png"))
        await ctx.close()
        await browser.close()

    print("\n=== RESULTADO ===")
    if failures:
        print(f"{len(failures)} problema(s):")
        for f in failures:
            print(" -", f)
        sys.exit(1)
    print("Todas as verificações passaram. Evidências em", OUT)


asyncio.run(run())
