from pathlib import Path

storefront_path = Path("src/components/storefront/barber-storefront.tsx")
source = storefront_path.read_text(encoding="utf-8")

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
storefront_path.write_text(source, encoding="utf-8")

test_path = Path("scripts/validate-barber-mobile-cards.mjs")
test = test_path.read_text(encoding="utf-8")
service_marker = '''      assert(serviceState.visibleRatio >= 0.6, `${label}: serviço não foi centralizado pelo teste`);
'''
if service_marker not in test:
    raise SystemExit("Service assertion marker missing")
test = test.replace(
    service_marker,
    service_marker
    + '''      const serviceSelection = await serviceRows.evaluateAll((rows) => {
        const viewportCenter = innerHeight / 2;
        const states = rows.map((row, index) => {
          const rect = row.getBoundingClientRect();
          return {
            index,
            active: row.getAttribute("data-active") === "true",
            distance: Math.abs(rect.top + rect.height / 2 - viewportCenter),
          };
        });
        return {
          activeIndexes: states.filter((state) => state.active).map((state) => state.index),
          nearestIndex: states.reduce((nearest, state) =>
            state.distance < nearest.distance ? state : nearest,
          ).index,
        };
      });
      assert(serviceState.active === "true", `${label}: serviço central não recebeu data-active=true`);
      assert(
        serviceSelection.activeIndexes.length === 1,
        `${label}: mais de um serviço ficou ativo (${serviceSelection.activeIndexes.join(", ")})`,
      );
      assert(
        serviceSelection.activeIndexes[0] === serviceSelection.nearestIndex,
        `${label}: serviço ativo não é o mais próximo do centro`,
      );
''',
    1,
)

report_marker = '''        serviceState,
        ritualState,
'''
if report_marker not in test:
    raise SystemExit("Service report marker missing")
test = test.replace(
    report_marker,
    '''        serviceState,
        serviceSelection,
        ritualState,
''',
    1,
)
test_path.write_text(test, encoding="utf-8")

workflow_path = Path(".github/workflows/validate-barber-mobile-cards.yml")
workflow = workflow_path.read_text(encoding="utf-8")
product_path = '      - "src/components/storefront/product-card.tsx"\n'
barber_path = '      - "src/components/storefront/barber-storefront.tsx"\n'
if barber_path not in workflow:
    workflow = workflow.replace(product_path, product_path + barber_path, 1)

prettier_anchor = '''            src/components/storefront/product-card.tsx \\
            scripts/validate-barber-mobile-cards.mjs
'''
prettier_barber = '            src/components/storefront/barber-storefront.tsx \\
'
if prettier_barber not in workflow:
    workflow = workflow.replace(
        prettier_anchor,
        '''            src/components/storefront/product-card.tsx \\
            src/components/storefront/barber-storefront.tsx \\
            scripts/validate-barber-mobile-cards.mjs
''',
        1,
    )

eslint_anchor = '          npx eslint src/components/storefront/product-card.tsx\n'
if eslint_anchor in workflow:
    workflow = workflow.replace(
        eslint_anchor,
        '''          npx eslint \\
            src/components/storefront/product-card.tsx \\
            src/components/storefront/barber-storefront.tsx
''',
        1,
    )
workflow_path.write_text(workflow, encoding="utf-8")
