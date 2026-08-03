from pathlib import Path

path = Path("scripts/validate-maison-scroll-layout.mjs")
source = path.read_text()

old = '''  const target = chapters.nth(1);
  const copy = target.getByTestId("fashion-chapter-copy");
  const targetBox = await target.boundingBox();
  assert(targetBox, `${scenario.name}: capítulo de teste sem posição`);

  await page.evaluate(
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

new = '''  const target = chapters.nth(1);
  const copy = target.getByTestId("fashion-chapter-copy");
  const targetDocumentTop = await target.evaluate(
    (node) => node.getBoundingClientRect().top + window.scrollY,
  );

  await page.evaluate(
    ({ top, height }) =>
      window.scrollTo({
        top: Math.max(0, top - height * 0.88),
        behavior: "instant",
      }),
    { top: targetDocumentTop, height: scenario.height },
  );
  await page.waitForTimeout(160);
  const before = Number(await copy.evaluate((node) => getComputedStyle(node).opacity));

  await target.evaluate((node) => {
    node.scrollIntoView({ behavior: "instant", block: "center", inline: "nearest" });
  });
  await page.waitForTimeout(720);
  const after = await target.evaluate((node) => {
    const targetRect = node.getBoundingClientRect();
    const copyNode = node.querySelector('[data-testid="fashion-chapter-copy"]');
    const copyRect = copyNode?.getBoundingClientRect();
    const visibleHeight = Math.max(
      0,
      Math.min(targetRect.bottom, innerHeight) - Math.max(targetRect.top, 0),
    );
    return {
      opacity: copyNode ? Number(getComputedStyle(copyNode).opacity) : 0,
      copyVisible: Boolean(copyRect && copyRect.top < innerHeight && copyRect.bottom > 0),
      targetVisibleRatio: visibleHeight / targetRect.height,
    };
  });
  assert(before < 0.5, `${scenario.name}: storytelling já nasce totalmente revelado (${before})`);
  assert(
    after.targetVisibleRatio >= 0.45,
    `${scenario.name}: capítulo não foi centralizado (${after.targetVisibleRatio})`,
  );
  assert(
    after.copyVisible && after.opacity > 0.82,
    `${scenario.name}: storytelling não conclui enquanto visível (${after.opacity})`,
  );
'''

if old not in source:
    raise RuntimeError("Bloco de rolagem do teste não encontrado")

path.write_text(source.replace(old, new, 1))
print("Posicionamento da regressão Maison corrigido")
