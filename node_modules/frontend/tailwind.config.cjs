/** @type {import('tailwindcss').Config} */
module.exports = {
    content: [
      "./index.html",
      "./src/**/*.{js,jsx,ts,tsx}",
    ],
    theme: {
      screens: {
        'xs': '378px',
        'sm': '640px',
        'md': '768px',
        'lg': '1024px',
        'xl': '1280px',
        '2xl': '1536px',
      },
      backgroundPosition: {
        right: "right 30% bottom 45% ",
      },
      extend: {
        backgroundImage: {
          'welcome-img': "url('/hero-image.png')",
          'banner-img': "url('/banner-image.jpg')",
          'banner-img2': "url('/gym-img.jpg')",

        },
      },
    },
    daisyui: {
      themes: [
        {
          mytheme: {
                    
            "primary": "#00d1ff",
                    
            "secondary": "#007cd6",
                    
            "accent": "#0000ff",
                    
            "neutral": "#1d1c21",
                    
            "base-100": "#fff",
                    
            "info": "#0084d4",
                    
            "success": "#22c55e",
                    
            "warning": "#eab308",
                    
            "error": "#ef4444",
          },
        },
      ],
    },
    plugins: [
      require('daisyui'),
    ],

  }