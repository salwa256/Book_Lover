
document.addEventListener("DOMContentLoaded", () => {
    const filters = document.querySelectorAll(".filter select");

    filters.forEach(select => {
        select.addEventListener("change", function() {
            if (this.value !== "") {
                this.classList.add("selected");
            } else {
                this.classList.remove("selected");
            }
        });
    });
});
  const buttons = document.querySelectorAll(".tabs");

  buttons.forEach(btn => {
    btn.addEventListener("click", () => {
      // hapus active dari semua button
      buttons.forEach(b => b.classList.remove("active"));

      // tambahkan active ke button yang diklik
      btn.classList.add("active");
    });
  });

