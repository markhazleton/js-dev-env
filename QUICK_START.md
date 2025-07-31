# 🚀 Quick Start Guide for Beginners

## 🎯 **Getting Started in 5 Minutes**

This guide helps you get up and running with the essential features first, then gradually explore advanced capabilities.

### **Step 1: Basic Setup (2 minutes)**

```bash
# Clone and setup
git clone https://github.com/markhazleton/js-dev-env.git
cd js-dev-env
npm install
npm run start:dev
```

Open `http://localhost:3000` in your browser - you're live! 🎉

### **Step 2: Your First Changes (3 minutes)**

1. **Edit content**: Open `data/pages.json` to modify page content
2. **Change styles**: Edit `scss/main.scss` for custom styling
3. **Add pages**: Create new routes in `index.js`

### **Step 3: Essential Commands**

| Command | What it does | When to use |
|---------|-------------|-------------|
| `npm run start:dev` | Start development server | Daily development |
| `npm run build` | Build for production | Before deploying |
| `npm run test` | Run tests | Before committing |
| `npm run lint` | Check code quality | Before committing |

## 🎓 **Learning Path**

### **Week 1: Basics**

- ✅ Get the app running
- ✅ Understand the file structure
- ✅ Make simple content changes
- ✅ Learn basic Bootstrap components

### **Week 2: Customization**

- 🎯 Customize the design
- 🎯 Add new pages
- 🎯 Understand the build process
- 🎯 Learn about SASS

### **Week 3: Advanced Features**

- 🔧 Explore Docker setup
- 🔧 Learn about testing
- 🔧 Understand security features
- 🔧 Deploy to GitHub Pages

### **Week 4: Production**

- 🚀 Optimize performance
- 🚀 Configure CI/CD
- 🚀 Add custom components
- 🚀 Scale your application

## 🛠️ **Essential Files for Beginners**

| File | Purpose | Priority |
|------|---------|----------|
| `data/pages.json` | Content management | ⭐⭐⭐ |
| `scss/main.scss` | Styling | ⭐⭐⭐ |
| `views/layout.ejs` | Page structure | ⭐⭐ |
| `index.js` | Server setup | ⭐⭐ |
| `package.json` | Dependencies | ⭐ |

## 🚨 **Common Issues & Solutions**

### **"Too many files!"**

- Start with just `data/pages.json` and `scss/main.scss`
- Ignore advanced features until you're comfortable
- Use the component library as reference, not starting point

### **"Build process is confusing!"**

- Use `npm run start:dev` for development
- Only use `npm run build` when ready to deploy
- The `/docs` folder is auto-generated - don't edit it

### **"Security features are overwhelming!"**

- They're enabled by default and work automatically
- Focus on content and styling first
- Security is handled for you

## 🎯 **Next Steps**

Once you're comfortable with the basics:

1. **Explore the component library** at `/components`
2. **Learn about Docker** with `npm run docker:dev`
3. **Add tests** for your custom features
4. **Deploy to GitHub Pages** with `npm run build`

## 📚 **Resources**

- [Bootstrap 5 Documentation](https://getbootstrap.com/docs/5.3/)
- [Express.js Guide](https://expressjs.com/en/guide/routing.html)
- [SASS Tutorial](https://sass-lang.com/guide)
- [Project Wiki](https://github.com/markhazleton/js-dev-env/wiki)

---

**Remember**: Start simple, learn gradually, and don't worry about using every feature at once! 🚀
