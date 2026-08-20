/**
 * jsdom implements no layout, so scrollIntoView simply doesn't exist on Element and
 * any component that auto-scrolls throws on mount. Stubbed here rather than guarded
 * in the components, since it's an environment gap and not something production code
 * should have to work around.
 */
if (!Element.prototype.scrollIntoView) {
    Element.prototype.scrollIntoView = () => {};
}
