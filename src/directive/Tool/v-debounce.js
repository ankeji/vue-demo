//防抖
const debounce = {
    inserted: function(el, binding) {
      let timer;
      let sougou = false;
      el.addEventListener("compositionstart", () => {
        sougou = true;
      });
      el.addEventListener("compositionend", () => {
        if (sougou) {
          if (timer) {
            clearTimeout(timer);
          }
          timer = setTimeout(() => {
            binding.value();
          }, 200);
         sougou = false;
        }
      });
      el.addEventListener("input", () => {
        if (!sougou) {
          if (timer) {
            clearTimeout(timer);
          }
          timer = setTimeout(() => {
            binding.value();
          }, 200);
        }
      });
    }
  }
  export default debounce;