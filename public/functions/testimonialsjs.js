async function loadTestimonials() {
  try {
    const res = await fetch('/api/testimonials');
    if (!res.ok) throw new Error('Failed to fetch testimonials');
    const data = await res.json();

    const list = document.getElementById("testimonialList");
    list.innerHTML = '';
    data.testimonials.forEach(text => {
      const card = document.createElement("div");
      card.className = "testimonial-card";
      card.innerHTML = `<h3>Anonymous</h3><p>${text}</p>`;
      list.appendChild(card);
    });
  } catch (err) {
    console.error('Error loading testimonials:', err);
  }
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

<<<<<<< Updated upstream
<<<<<<< Updated upstream
  const list = document.getElementById("testimonialList");
  const newCard = document.createElement("div");
  newCard.className = "testimonial-card";
  newCard.innerHTML = `<h3>Anonymous</h3><p>${value}</p>`;

  list.prepend(newCard);
  input.value = "";
  closeForm();
}


window.onload = loadTestimonials

=======
=======
>>>>>>> Stashed changes
  const response = await fetch('/api/testimonials', {
    method: 'POST',
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ testimonial: value })
  });

  if (response.ok) {
    const list = document.getElementById("testimonialList");
    const newCard = document.createElement("div");
    newCard.className = "testimonial-card";
    newCard.innerHTML = `<h3>Anonymous</h3><p>${value}</p>`;
    list.prepend(newCard);

    input.value = "";
    closeForm();
  } else {
    console.error('Error submitting testimonial:', response.statusText);
    alert('Failed to submit testimonial. Please try again.');
  }
}

window.onload = loadTestimonials;
<<<<<<< Updated upstream
>>>>>>> Stashed changes
=======
>>>>>>> Stashed changes
