import React from 'react';

export default function About() {
  return (
    <div className="bg-gray-50 py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-4xl font-bold text-gray-900 mb-8 text-center">About Us</h1>
        
        <div className="bg-white rounded-xl shadow-lg p-8 prose max-w-none">
          <p>
            Welcome to Free Shoe Identifier, your go-to resource for AI-powered footwear and sneaker identification.
            We're passionate about helping people discover and learn about different shoe models through
            technology, while providing valuable shopping information and insights.
          </p>

          <h2>Our Mission</h2>
          <p>
            Our mission is to make sneaker and footwear identification accessible to everyone by providing a free, easy-to-use
            shoe recognition tool. We aim to help enthusiasts, collectors, and casual shoppers identify shoes they're interested in,
            learn about their specifications, and discover where to purchase them. Our tool is designed for informational
            purposes, helping sneakerheads, fashion enthusiasts, and curious minds identify different
            shoes from around the world.
          </p>

          <h2>Why Choose Our Tool?</h2>
          <ul>
            <li>Advanced AI shoe recognition technology</li>
            <li>Detailed brand and model information</li>
            <li>Material and design specifications</li>
            <li>Pricing and shopping guidance</li>
            <li>Cultural significance and popularity details</li>
            <li>Completely free to use</li>
            <li>No registration required</li>
            <li>Privacy-focused approach</li>
            <li>Regular updates to improve accuracy</li>
          </ul>

          <h2>Support Our Project</h2>
          <p>
            We're committed to keeping this shoe identification tool free and accessible to everyone.
            If you find our tool useful, consider supporting us by buying us a coffee.
            Your support helps us maintain and improve the service, ensuring it remains available to all
            footwear enthusiasts who want to learn about and identify shoes.
          </p>

          <div className="mt-8 text-center">
            <a
              href="https://roihacks.gumroad.com/l/dselxe?utm_campaign=donation-home-page&utm_medium=website&utm_source=shoe-identifier"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-6 py-3 bg-yellow-400 text-gray-900 rounded-lg hover:bg-yellow-500 transition-colors text-lg font-semibold"
            >
              Support Our Work
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}