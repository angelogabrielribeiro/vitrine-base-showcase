from pathlib import Path

path = Path("src/components/storefront/barber-storefront.tsx")
source = path.read_text(encoding="utf-8")

active_anchor = "  const active = items[activeIdx];\n"
if active_anchor not in source:
    raise SystemExit("ServicesEditorial active anchor missing")
source = source.replace(
    active_anchor,
    '''  const active = items[activeIdx];
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    if (!isMobile) return;

    let frame = 0;
    const updateActiveService = () => {
      window.cancelAnimationFrame(frame);
      frame = window.requestAnimationFrame(() => {
        const rows = sectionRef.current?.querySelectorAll<HTMLElement>(
          "[data-service-index]",
        );
        if (!rows?.length) return;

        const viewportCenter = window.innerHeight / 2;
        let nearestIndex = 0;
        let nearestDistance = Number.POSITIVE_INFINITY;

        rows.forEach((row) => {
          const rect = row.getBoundingClientRect();
          const distance = Math.abs(rect.top + rect.height / 2 - viewportCenter);
          if (distance >= nearestDistance) return;
          nearestDistance = distance;
          nearestIndex = Number(row.dataset.serviceIndex ?? 0);
        });

        setActiveIdx(nearestIndex);
      });
    };

    updateActiveService();
    window.addEventListener("scroll", updateActiveService, { passive: true });
    window.addEventListener("resize", updateActiveService);
    return () => {
      window.cancelAnimationFrame(frame);
      window.removeEventListener("scroll", updateActiveService);
      window.removeEventListener("resize", updateActiveService);
    };
  }, [isMobile]);
''',
    1,
)

section_anchor = '<section className="mx-auto max-w-7xl px-6 py-20 sm:py-16">'
if section_anchor not in source:
    raise SystemExit("ServicesEditorial section missing")
source = source.replace(
    section_anchor,
    '<section ref={sectionRef} className="mx-auto max-w-7xl px-6 py-20 sm:py-16">',
    1,
)

observer_anchor = '  const { ref, inView } = useInView<HTMLLIElement>({ amount: 0.6 });\n'
if observer_anchor not in source:
    raise SystemExit("ServiceRow observer missing")
source = source.replace(observer_anchor, "", 1)

old_activation = '''  // Mobile: acende sozinho ao entrar na viewport, em sequência com o scroll.
  // Desktop: reage a hover/foco, sem cursor simulado.
  const active = autoActivate ? inView : hovered;

  useEffect(() => {
    if (autoActivate && inView) onActivate?.();
  }, [autoActivate, inView, onActivate]);
'''
new_activation = '''  // Mobile: a linha mais próxima do centro da viewport acende automaticamente.
  // Desktop: reage a hover/foco, sem cursor simulado.
  const active = autoActivate ? Boolean(isActive) : hovered;
'''
if old_activation not in source:
    raise SystemExit("ServiceRow activation block missing")
source = source.replace(old_activation, new_activation, 1)

li_anchor = '''    <li
      ref={ref}'''
if li_anchor not in source:
    raise SystemExit("ServiceRow li missing")
source = source.replace(
    li_anchor,
    '''    <li
      data-service-index={index}''',
    1,
)

path.write_text(source, encoding="utf-8")
