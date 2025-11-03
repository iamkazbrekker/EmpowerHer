async function loadTestimonials(){
  const res = await fetch ('/api')
  const data = await res.json()

  const list = document.getElementById("testimonialList");
  data.testimonials.forEach(text => {
    const card = document.createElement("div");
    card.className = "testimonial-card";
    card.innerHTML = `<h3>Anonymous</h3><p>${text}</p>`;
    list.appendChild(card);
  });

}

function openForm() {
  document.getElementById("popupForm").style.display = "flex";
}

function closeForm() {
  document.getElementById("popupForm").style.display = "none";
}

function submitTestimonial() {
  const input = document.getElementById("testimonialInput");
  const value = input.value.trim();

  if (value === "") {
    alert("Please write something before submitting.");
    return;
  }

  const list = document.getElementById("testimonialList");
  const newCard = document.createElement("div");
  newCard.className = "testimonial-card";
  newCard.innerHTML = `<h3>Anonymous</h3><p>${value}</p>`;

  list.prepend(newCard);
  input.value = "";
  closeForm();
}


window.onload = loadTestimonials

