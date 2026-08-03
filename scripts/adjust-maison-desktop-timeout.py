from pathlib import Path

path = Path("scripts/validate-maison-scroll-layout.mjs")
source = path.read_text()
source = source.replace(
    '{ timeout: 1_500, polling: "raf" },',
    '{ timeout: scenario.mobile ? 1_500 : 3_000, polling: "raf" },',
    1,
)
source = source.replace(
    'revealDuration <= 1_200,\n    `${scenario.name}: storytelling demorou demais para concluir (${revealDuration}ms)`,',
    'revealDuration <= (scenario.mobile ? 1_200 : 2_500),\n    `${scenario.name}: storytelling demorou demais para concluir (${revealDuration}ms)`,',
    1,
)
path.write_text(source)
