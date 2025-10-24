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

// Initial 12 example testimonials
const exampleTestimonials = [
  "This website gave me the confidence to walk alone without fear.",
  "The self-defense videos are clear, effective, and empowering!",
  "I feel so much more secure after going through your resources.",
  "Your workshops helped me protect myself and my loved ones.",
  "Finally, a community that truly supports women!",
  "Thanks to this platform, I learned to escape dangerous situations.",
  "Amazing initiative! Every woman should use this.",
  "This hub gave me the strength I didn't know I had.",
  "The survival stories are incredibly inspiring and real.",
  "Practical tips, useful resources, and constant encouragement.",
  "I found the help I needed when I felt helpless.",
  "Grateful for the support and tools offered here."
];

window.onload = function () {
  const list = document.getElementById("testimonialList");
  exampleTestimonials.forEach(text => {
    const card = document.createElement("div");
    card.className = "testimonial-card";
    card.innerHTML = `<h3>Anonymous</h3><p>${text}</p>`;
    list.appendChild(card);
  });
};

