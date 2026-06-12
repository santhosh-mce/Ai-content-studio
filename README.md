# 🚀 AI Content Studio

Create Viral Content in Seconds with AI.

AI Content Studio is a complete SaaS platform for content creators, YouTubers, Instagram influencers, agencies, and businesses. Generate YouTube thumbnails, social media posts, reels scripts, AI images, and manage your content calendar from a single dashboard.

---

# ✨ Features

## AI Thumbnail Studio

Generate high-converting YouTube thumbnails.

Features:

* AI-powered thumbnail prompts
* Custom niche support
* FLUX image generation
* Cloudinary storage
* Download thumbnails
* Media library integration

Public Image:

```text
/public/thumbnail-studio.png
```

---

## AI Social Post Generator

Create social media content instantly.

Supported Platforms:

* Instagram
* Facebook
* LinkedIn
* X (Twitter)

Features:

* AI captions
* Hashtag generation
* CTA suggestions
* AI image generation
* Multiple post variations

Public Image:

```text
/public/social-post.png
```

---

## AI Reel Script Generator

Generate viral reel scripts.

Features:

* Hook generation
* Storyline generation
* CTA creation
* Voiceover script
* Scene breakdown
* Video prompt generation

Optional:

* xAI Grok Imagine Video
* Text-to-video workflow

Public Image:

```text
/public/reels-generator.png
```

---

## Content Calendar

Plan content for 30 days automatically.

Features:

* Monthly planner
* Content scheduling
* Platform filtering
* Campaign tracking
* Drag and drop posts
* Content idea generation

Public Image:

```text
/public/calendar-preview.png
```

---

## Media Library

Store all generated assets.

Features:

* Images
* Thumbnails
* Social posts
* Downloads
* Search and filter
* Cloudinary integration

Public Image:

```text
/public/media-library.png
```

---

# 🧠 AI Architecture

## Naraya Router

Used for:

* Caption generation
* Reel scripts
* Content ideas
* CTA generation
* Marketing copy

Example:

```text
Model:
MiniMax-M3
DeepSeek
Qwen
GPT Models
```

---

## FLUX Kontext

Used for:

* Thumbnail creation
* Social media creatives
* AI images
* Marketing graphics

Workflow:

```text
User Prompt
↓
FLUX Kontext API
↓
Image Generated
↓
Cloudinary Upload
↓
Media Library
```

---

# ☁️ Cloudinary Integration

Purpose:

* Store generated images
* CDN delivery
* Fast image loading
* Media library support

Folder Structure:

```text
ai-content-studio/
 ├─ thumbnails/
 ├─ posts/
 ├─ reels/
 ├─ uploads/
```

---

# 🗄️ Database

PostgreSQL + Prisma

Tables:

## Users

```text
id
name
email
plan
credits
avatar
createdAt
```

## Projects

```text
id
userId
title
type
createdAt
```

## Generations

```text
id
userId
prompt
output
model
createdAt
```

## Media

```text
id
userId
title
imageUrl
type
publicId
createdAt
```

## Calendar Events

```text
id
userId
title
platform
scheduledDate
status
```

## Subscriptions

```text
id
userId
plan
status
renewalDate
```

---

# 💳 Pricing Plans

## Free

* 20 Credits
* Basic AI Models
* Media Library

## Starter

$19/month

* 500 Credits
* Priority Generation
* Media Library

## Pro

$49/month

* 5000 Credits
* Unlimited Projects
* Faster AI Generation

## Agency

$99/month

* Team Workspace
* API Access
* White Label
* Unlimited Storage

---

# 🎨 Landing Page Sections

## Hero Section

Headline:

Create Viral Content in Seconds

Subheadline:

Generate thumbnails, posts, reels and AI images from one dashboard.

CTA:

* Start Free
* Watch Demo

---

## Features Section

Cards:

* Thumbnail Studio
* Social Post Generator
* Reel Script Generator
* Content Calendar
* Media Library

---

## AI Workflow Section

```text
Prompt
↓
Naraya AI
↓
FLUX Image
↓
Cloudinary
↓
Media Library
↓
Schedule Content
```

---

## Pricing Section

Free
Starter
Pro
Agency

---

## FAQ Section

Common questions about:

* Credits
* AI generation
* Billing
* Storage

---

# ✨ Premium Animations

Use:

* Framer Motion
* Lenis Smooth Scroll

Animations:

* Floating AI Orbs
* Mouse Glow Effect
* Count-up Statistics
* Animated Feature Cards
* AI Workflow Animation
* Dashboard Auto Preview
* Gradient Border Effects

---

# 📂 Public Folder Structure

```text
public/

logo.png

hero-dashboard.png

thumbnail-studio.png

social-post.png

reels-generator.png

calendar-preview.png

media-library.png

pricing-preview.png

avatar-placeholder.png

empty-state.png
```

---

# 🛠️ Tech Stack

Frontend:

* Next.js 16
* React 19
* TypeScript
* Tailwind CSS
* Shadcn UI
* Framer Motion

Backend:

* Next.js Server Actions
* Prisma ORM
* PostgreSQL

Authentication:

* Auth.js
* Google OAuth

Storage:

* Cloudinary

AI:

* Naraya Router
* FLUX Kontext

Payments:

* Stripe

Deployment:

* Vercel
* PostgreSQL (Neon)

---

# 🚀 Future Roadmap

* AI Video Generator
* Team Collaboration
* Brand Kit Management
* Pinterest Content Generator
* Multi-language Content
* Auto Publishing
* Analytics Dashboard
* Mobile App
* AI Influencer Tools

Built for creators who want to create more content in less time.
