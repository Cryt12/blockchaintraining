// Theme-aware chart tokens. Recharts needs explicit colors, so these are chosen
// per light/dark mode. The donut ramp is a single-hue ORDINAL blue ramp (validated
// with the dataviz palette validator, --ordinal, both modes) so category slices are
// told apart by an ordered shade + direct label + legend, never by hue alone.
export function getChartTheme(theme) {
  const dark = theme === 'dark';
  return {
    // Recessive chrome
    grid: dark ? '#2c2c2a' : '#e1e0d9',
    axis: '#898781',
    tick: '#898781',
    tooltipBg: dark ? '#0f172a' : '#ffffff',
    tooltipBorder: dark ? '#1e293b' : '#e2e8f0',
    tooltipText: dark ? '#e2e8f0' : '#0f172a',
    // Single-series accent (matches the app's primary)
    series: dark ? '#3987e5' : '#2563EB',
    // Ordinal blue ramp for the 4-slice category donut
    ordinal: dark
      ? ['#9ec5f4', '#5598e7', '#2a78d6', '#184f95']
      : ['#86b6ef', '#5598e7', '#2a78d6', '#184f95'],
  };
}
