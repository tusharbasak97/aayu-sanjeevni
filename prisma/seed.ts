import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Seeding database...");

  // Create admin user
  const passwordHash = await bcrypt.hash("admin123", 12);

  const admin = await prisma.admin.upsert({
    where: { email: "admin@aayusanjeevni.org" },
    update: {},
    create: {
      name: "Admin",
      email: "admin@aayusanjeevni.org",
      passwordHash,
    },
  });

  console.log(`✅ Admin created: ${admin.email} (password: admin123)`);

  // Create sample blog posts
  const blog1 = await prisma.blog.upsert({
    where: { slug: "importance-of-free-healthcare" },
    update: {},
    create: {
      title: "The Importance of Free Healthcare for Underprivileged Communities",
      slug: "importance-of-free-healthcare",
      content: `<p>Access to healthcare is a fundamental human right, yet millions of people in India remain underserved. At Aayu Sanjeevni, we believe that financial constraints should never be a barrier to receiving quality medical care.</p>
<h2>The Healthcare Gap in India</h2>
<p>According to recent studies, over 60% of India's population lacks access to essential healthcare services. Rural communities are disproportionately affected, with limited access to hospitals, diagnostic centers, and qualified medical professionals.</p>
<h2>How Aayu Sanjeevni Bridges This Gap</h2>
<p>Through our network of partner hospitals, volunteer doctors, and mobile medical camps, we bring world-class healthcare directly to those who need it most. Every service we provide — from diagnosis to treatment — is completely free.</p>
<h2>Our Impact</h2>
<p>Since our inception, we have served over 10,000 patients across multiple states, organized 50+ medical camps, and distributed thousands of free prescriptions. Every life we touch reinforces our commitment to this noble cause.</p>`,
      excerpt:
        "Access to healthcare is a fundamental human right. Learn how Aayu Sanjeevni is bridging the healthcare gap for underprivileged communities.",
      status: "PUBLISHED",
      publishedAt: new Date(),
      authorId: admin.id,
      seo: {
        create: {
          metaTitle: "The Importance of Free Healthcare | Aayu Sanjeevni",
          metaDescription:
            "Discover why free healthcare access matters and how Aayu Sanjeevni provides world-class medical care to underprivileged communities at zero cost.",
          focusKeywords: "free healthcare, underprivileged, NGO, medical care, India",
        },
      },
    },
  });

  const blog2 = await prisma.blog.upsert({
    where: { slug: "health-tips-monsoon-season" },
    update: {},
    create: {
      title: "Essential Health Tips for the Monsoon Season",
      slug: "health-tips-monsoon-season",
      content: `<p>The monsoon season brings relief from the summer heat, but it also brings a host of health challenges. Here are essential tips to stay healthy during the rains.</p>
<h2>1. Stay Hydrated with Clean Water</h2>
<p>Always drink boiled or purified water. Contaminated water is the leading cause of waterborne diseases during monsoon.</p>
<h2>2. Boost Your Immunity</h2>
<p>Include Vitamin C-rich foods like citrus fruits, amla, and green vegetables in your diet. A strong immune system is your best defense.</p>
<h2>3. Protect Against Mosquitoes</h2>
<p>Use mosquito nets, repellents, and ensure there is no stagnant water around your home. Dengue and malaria cases surge during this season.</p>
<h2>4. Maintain Personal Hygiene</h2>
<p>Wash your hands frequently, keep your feet dry, and change out of wet clothes immediately to prevent fungal infections.</p>`,
      excerpt:
        "Stay healthy this monsoon with these essential tips on hydration, immunity, mosquito protection, and hygiene.",
      status: "PUBLISHED",
      publishedAt: new Date(Date.now() - 86400000),
      authorId: admin.id,
      seo: {
        create: {
          metaTitle: "Monsoon Health Tips | Aayu Sanjeevni",
          metaDescription:
            "Essential health tips for the monsoon season from Aayu Sanjeevni. Learn how to protect yourself from waterborne diseases and stay healthy.",
          focusKeywords: "monsoon health tips, rainy season health, waterborne diseases, immunity",
        },
      },
    },
  });

  console.log(`✅ Blog posts created: ${blog1.title}, ${blog2.title}`);

  // Create sample events
  const event1 = await prisma.event.upsert({
    where: { slug: "free-medical-camp-delhi-2026" },
    update: {},
    create: {
      title: "Free Medical Camp - Delhi NCR",
      slug: "free-medical-camp-delhi-2026",
      description: `<p>Join us for a comprehensive free medical camp in Delhi NCR. Our team of renowned specialists will provide:</p>
<ul>
<li>General health checkups</li>
<li>Eye examinations</li>
<li>Dental checkups</li>
<li>Blood sugar and pressure monitoring</li>
<li>Free medicine distribution</li>
<li>Health awareness sessions</li>
</ul>
<p>All services are completely free. No registration required — just walk in!</p>`,
      location: "Community Hall, Sector 18, Noida",
      eventDate: new Date(Date.now() + 7 * 86400000),
      eventEndDate: new Date(Date.now() + 8 * 86400000),
      status: "UPCOMING",
      authorId: admin.id,
      seo: {
        create: {
          metaTitle: "Free Medical Camp Delhi NCR 2026 | Aayu Sanjeevni",
          metaDescription:
            "Attend our free medical camp in Delhi NCR. Get free health checkups, eye exams, dental care, and medicines from top specialists.",
          focusKeywords: "free medical camp, Delhi, health checkup, free medicines, NGO",
        },
      },
    },
  });

  const event2 = await prisma.event.upsert({
    where: { slug: "rural-outreach-rajasthan" },
    update: {},
    create: {
      title: "Rural Health Outreach - Rajasthan",
      slug: "rural-outreach-rajasthan",
      description: `<p>Our mobile medical team is heading to rural Rajasthan for a week-long health outreach program. We will be setting up temporary clinics in 5 villages to provide essential healthcare services.</p>
<p>This outreach will include pediatric care, women's health screenings, chronic disease management, and distribution of essential medicines.</p>`,
      location: "Multiple villages, Jodhpur District",
      eventDate: new Date(Date.now() - 14 * 86400000),
      eventEndDate: new Date(Date.now() - 7 * 86400000),
      status: "PAST",
      authorId: admin.id,
    },
  });

  console.log(`✅ Events created: ${event1.title}, ${event2.title}`);

  console.log("\n🎉 Seeding complete!");
  console.log("📧 Admin login: admin@aayusanjeevni.org / admin123");
}

main()
  .then(() => prisma.$disconnect())
  .catch((e) => {
    console.error(e);
    prisma.$disconnect();
    process.exit(1);
  });
