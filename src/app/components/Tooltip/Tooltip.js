export default class Tooltip {
  constructor() {
    this.tooltips = [];

    this.removeTooltip = this.removeTooltip.bind(this);
  }

  addTooltip(message, targetElem) {
    console.log('addTooltip');
    const id = performance.now();

    const tooltip = document.createElement('div');
    tooltip.className = 'form-error';
    tooltip.textContent = message;

    this.tooltips.push({
      id,
      tooltip,
    });

    document.body.appendChild(tooltip);

    if (targetElem) {
      const coords = targetElem.getBoundingClientRect();

      console.log(coords);
      console.log(targetElem.style.top);

      tooltip.style.top = `${coords.top + coords.height / 2 - tooltip.offsetHeight / 2 + window.scrollY}px`;
      tooltip.style.left = `${coords.right + 10 + window.scrollX}px`;
    }

    setTimeout(() => this.removeTooltip(id), 10000);

    return id;
  }

  removeTooltip(id) {
    const removing = this.tooltips.findIndex((tooltip) => tooltip.id === id);

    if (removing === -1) return;

    this.tooltips[removing].tooltip.remove();
    this.tooltips.splice(removing, 1);
  }
}
