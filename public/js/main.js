document.addEventListener("DOMContentLoaded", () => {
  // Function to Fetch and Display Products
  async function loadProducts() {
    const productsContainer = document.getElementById("productsContainer");

    try {
      const response = await fetch("/api/products"); // Fetch from backend API
      const data = await response.json();
      console.log("API Response:", data); // Debugging

      // Validate API response structure
      if (!data.products || !Array.isArray(data.products)) {
        throw new Error("Invalid API response: Expected an array of products");
      }

      const products = data.products;
      productsContainer.innerHTML = "";

      // If no products exist, show a message
      if (products.length === 0) {
        productsContainer.innerHTML = "<p>No products available.</p>";
        return;
      }

      // Loop through the products and display them
      products.forEach((product) => {
        const productCard = document.createElement("div");
        productCard.classList.add("product-card");

        productCard.innerHTML = `
            <h2>${product.name}</h2>
            <p>${product.description}</p>
            <p><strong>Price:</strong> $${product.price.toFixed(2)}</p>
            <p><strong>Stock:</strong> ${product.quantity} available</p>
            <button class="add-to-cart" data-id="${product._id}" data-name="${product.name}" data-price="${product.price}">Add to Cart</button>
        `;
        productsContainer.appendChild(productCard);
      });

      // Attach event listeners to "Add to Cart" buttons
      document.querySelectorAll(".add-to-cart").forEach((button) => {
        button.addEventListener("click", (event) => {
          const productId = event.target.dataset.id;
          const productName = event.target.dataset.name;
          const productPrice = parseFloat(event.target.dataset.price);
          addToCart(productId, productName, productPrice);
        });
      });
    } catch (error) {
      console.error("Error loading products:", error);
      productsContainer.innerHTML =
        "<p>Error loading products. Please try again later.</p>";
    }
  }

  loadProducts(); // Call the function to fetch products

  // Function to Handle Adding Products to Cart
  function addToCart(productId, name, price) {
    let cart = JSON.parse(localStorage.getItem("cart")) || [];

    const existingItem = cart.find((item) => item.id === productId);
    if (existingItem) {
      existingItem.quantity += 1;
    } else {
      cart.push({ id: productId, name, price, quantity: 1 });
    }

    localStorage.setItem("cart", JSON.stringify(cart));
    alert(`Added ${name} to cart!`);
  }

  // Function to Display Cart Items
  function displayCart() {
    const cartContainer = document.getElementById("cartContainer");
    if (!cartContainer) return;

    let cart = JSON.parse(localStorage.getItem("cart")) || [];
    cartContainer.innerHTML = "";

    if (cart.length === 0) {
      cartContainer.innerHTML = "<p>Your cart is empty.</p>";
      return;
    }

    let totalAmount = 0;
    cart.forEach((item, index) => {
      const productDiv = document.createElement("div");
      productDiv.classList.add("cart-item");

      const itemTotal = item.price * item.quantity;
      totalAmount += itemTotal;

      productDiv.innerHTML = `
        <h3>${item.name}</h3>
        <p>Price: $${item.price.toFixed(2)}</p>
        <p>Quantity: ${item.quantity}</p>
        <p>Total: $${itemTotal.toFixed(2)}</p>
        <button class="remove-item" data-index="${index}">Remove</button>
      `;

      cartContainer.appendChild(productDiv);
    });

    const totalDiv = document.createElement("div");
    totalDiv.innerHTML = `<h3>Total: $${totalAmount.toFixed(2)}</h3>`;
    cartContainer.appendChild(totalDiv);

    document.querySelectorAll(".remove-item").forEach((button) => {
      button.addEventListener("click", (event) => {
        const index = event.target.dataset.index;
        cart.splice(index, 1);
        localStorage.setItem("cart", JSON.stringify(cart));
        displayCart();
      });
    });
  }

  displayCart(); // Call function if on cart page

  // Function to Place an Order
  async function placeOrder() {
    let cart = JSON.parse(localStorage.getItem("cart")) || [];
    if (cart.length === 0) {
      alert("Your cart is empty.");
      return;
    }

    const user = localStorage.getItem("userId");
    if (!user) {
      alert("Please log in to place an order.");
      return;
    }

    const orderData = {
      user,
      products: cart.map((item) => ({
        product: item.id,
        quantity: item.quantity,
      })),
    };

    try {
      const response = await fetch("/api/orders/", { // Corrected route
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(orderData),
      });

      if (response.ok) {
        alert("Order placed successfully!");
        localStorage.removeItem("cart"); // Clear cart
        displayCart();
        window.location.reload(); // Refresh page after order
      } else {
        const data = await response.json();
        alert(data.message || "Failed to place order.");
      }
    } catch (error) {
      console.error("Error placing order:", error);
      alert("An error occurred while placing the order. Please try again.");
    }
  }

  const placeOrderBtn = document.getElementById("placeOrderBtn");
  if (placeOrderBtn) {
    placeOrderBtn.addEventListener("click", placeOrder);
  }

  // Handle Login Form Submission
  const loginForm = document.getElementById("loginForm");
  if (loginForm) {
    loginForm.addEventListener("submit", async (e) => {
      e.preventDefault();
      const username = document.getElementById("username").value;
      const password = document.getElementById("password").value;

      try {
        const response = await fetch("/api/auth/login", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ username, password }),
        });
        const data = await response.json();

        if (response.ok) {
          console.log("Login Response:", data);
          localStorage.setItem("userId", data.userId);
          alert("Login successful!");
          window.location.href = "products.html";
        } else {
          alert(data.message || "Login failed.");
        }
      } catch (error) {
        console.error("Error during login:", error);
      }
    });
  }

  // Handle Signup Form Submission
  const signupForm = document.getElementById("signupForm");
  if (signupForm) {
    signupForm.addEventListener("submit", async (e) => {
      e.preventDefault();
      const username = document.getElementById("username").value;
      const password = document.getElementById("password").value;

      try {
        const response = await fetch("/api/auth/signup", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ username, password }),
        });
        const data = await response.json();

        if (response.ok) {
          alert("Signup successful!");
          window.location.href = "login.html";
        } else {
          alert(data.message || "Signup failed.");
        }
      } catch (error) {
        console.error("Error during signup:", error);
      }
    });
  }
});
