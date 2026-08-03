from pathlib import Path

path = Path("scripts/validate-maison-scroll-layout.mjs")
source = path.read_text()

old = '''  await page.waitForTimeout(720);
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

new = '''  const revealStartedAt = Date.now();
  await page.waitForFunction(
    () => {
      const chapter = document.querySelectorAll('[data-testid="fashion-chapter"]')[1];
      const copyNode = chapter?.querySelector('[data-testid="fashion-chapter-copy"]');
      if (!chapter || !copyNode) return false;

      const targetRect = chapter.getBoundingClientRect();
      const copyRect = copyNode.getBoundingClientRect();
      const visibleHeight = Math.max(
        0,
        Math.min(targetRect.bottom, innerHeight) - Math.max(targetRect.top, 0),
      );
      const targetVisibleRatio = visibleHeight / targetRect.height;
      const copyVisible = copyRect.top < innerHeight && copyRect.bottom > 0;
      const opacity = Number(getComputedStyle(copyNode).opacity);
      return targetVisibleRatio >= 0.45 && copyVisible && opacity > 0.82;
    },
    undefined,
    { timeout: 1_500, polling: "raf" },
  );
  const revealDuration = Date.now() - revealStartedAt;
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
      revealDuration,
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
  assert(
    revealDuration <= 1_200,
    `${scenario.name}: storytelling demorou demais para concluir (${revealDuration}ms)`,
  );
'''

if old not in source:
    raise RuntimeError("Bloco de sincronização do teste Maison não encontrado")

path.write_text(source.replace(old, new, 1))
print("Validação Maison sincronizada com o estado visual")
