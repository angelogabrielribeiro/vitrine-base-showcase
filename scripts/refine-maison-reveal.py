from pathlib import Path
import re

ROOT = Path(__file__).resolve().parents[1]
source_path = ROOT / "src/components/storefront/fashion-storefront.tsx"
test_path = ROOT / "scripts/validate-maison-scroll-layout.mjs"

source = source_path.read_text()
source = source.replace(
    'import { motion, useReducedMotion, useScroll, useTransform } from "framer-motion";',
    'import { motion, useReducedMotion } from "framer-motion";',
    1,
)

source, count = re.subn(
    r'  const \{ scrollYProgress \} = useScroll\(\{.*?  const lineScale = useTransform\(scrollYProgress, \[0\.06, 0\.84\], \[0, 1\]\);\n\n',
    '',
    source,
    count=1,
    flags=re.S,
)
if count != 1:
    raise RuntimeError("Bloco scroll-linked antigo não encontrado")

source = source.replace(
    '  const mobileTransition = { duration: 0.62, ease: [0.22, 1, 0.36, 1] as const };',
    '  const chapterTransition = { duration: 0.5, ease: [0.22, 1, 0.36, 1] as const };',
    1,
)
source = source.replace(
    'className="relative border-t border-[#ead1c8]/12 bg-[#25131d] py-16 lg:min-h-[145svh] lg:py-0"',
    'className="relative border-t border-[#ead1c8]/12 bg-[#25131d] py-16 lg:min-h-[128svh] lg:py-0"',
    1,
)

old_line = '''          <motion.div
            className="h-full w-px origin-top bg-[#c99a55] shadow-[0_0_20px_rgba(201,154,85,.52)]"
            style={reduceMotion ? { scaleY: 1 } : { scaleY: lineScale }}
          />'''
new_line = '''          <motion.div
            className="h-full w-px origin-top bg-[#c99a55] shadow-[0_0_20px_rgba(201,154,85,.52)]"
            initial={reduceMotion ? false : { scaleY: 0 }}
            whileInView={reduceMotion ? undefined : { scaleY: 1 }}
            viewport={{ once: false, amount: 0.24 }}
            transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
          />'''
if old_line not in source:
    raise RuntimeError("Linha editorial não encontrada")
source = source.replace(old_line, new_line, 1)

source, count = re.subn(
    r'(data-testid="fashion-chapter-media"\n)\s*initial=.*?\n\s*className=',
    r'''\1            initial={reduceMotion ? false : { opacity: 0, y: 24, scale: 0.99 }}
            whileInView={reduceMotion ? undefined : { opacity: 1, y: 0, scale: 1 }}
            viewport={{
              once: false,
              amount: isDesktop ? 0.2 : 0.16,
              margin: "0px 0px -4% 0px",
            }}
            transition={chapterTransition}
            className=''',
    source,
    count=1,
    flags=re.S,
)
if count != 1:
    raise RuntimeError("Props da mídia não encontrados")

source, count = re.subn(
    r'(data-testid="fashion-chapter-copy"\n)\s*initial=.*?\n\s*className=',
    r'''\1            initial={
              reduceMotion ? false : { opacity: 0, x: index % 2 === 0 ? -20 : 20, y: 14 }
            }
            whileInView={reduceMotion ? undefined : { opacity: 1, x: 0, y: 0 }}
            viewport={{
              once: false,
              amount: isDesktop ? 0.18 : 0.1,
              margin: "0px 0px -2% 0px",
            }}
            transition={{ ...chapterTransition, delay: reduceMotion ? 0 : 0.05 }}
            className=''',
    source,
    count=1,
    flags=re.S,
)
if count != 1:
    raise RuntimeError("Props do texto não encontrados")

source_path.write_text(source)

test = test_path.read_text()
replacement = '''  await page.evaluate(
    ({ top, height }) =>
      window.scrollTo({
        top: Math.max(0, top - height * 0.85),
        behavior: "instant",
      }),
    { top: targetBox.y, height: scenario.height },
  );
  await page.waitForTimeout(140);
  const before = Number(await copy.evaluate((node) => getComputedStyle(node).opacity));

  await page.evaluate(
    ({ top, height }) =>
      window.scrollTo({
        top: Math.max(0, top - height * 0.12),
        behavior: "instant",
      }),
    { top: targetBox.y, height: scenario.height },
  );
  await page.waitForTimeout(720);
  const after = await copy.evaluate((node) => {
    const rect = node.getBoundingClientRect();
    return {
      opacity: Number(getComputedStyle(node).opacity),
      visible: rect.top < innerHeight && rect.bottom > 0,
    };
  });
  assert(before < 0.5, `${scenario.name}: storytelling já nasce totalmente revelado (${before})`);
  assert(
    after.visible && after.opacity > 0.82,
    `${scenario.name}: storytelling não conclui enquanto visível (${after.opacity})`,
  );
'''

test, count = re.subn(
    r'  if \(scenario\.mobile\) \{.*?\n  return metrics;',
    replacement + '\n  return metrics;',
    test,
    count=1,
    flags=re.S,
)
if count != 1:
    raise RuntimeError("Bloco de teste do storytelling não encontrado")

test_path.write_text(test)
print("Storytelling Maison refinado")
