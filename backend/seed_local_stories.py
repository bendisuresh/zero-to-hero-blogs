import os

from app import app
from database import db
from models import Post


stories = [
    {
        "title": "Kiran Mazumdar-Shaw: Building a Biotech Company from India",
        "description": "Kiran Mazumdar-Shaw built Biocon from a small beginning into a major biotechnology company, demonstrating the importance of scientific innovation, persistence and long-term thinking.",
        "category": "Business",
        "storyteller": "Kiran Mazumdar-Shaw",
        "storyteller_email": "",
        "starting_point": "She started with a small biotechnology venture at a time when the industry was still developing in India.",
        "how_started": "She focused on building scientific capabilities and gradually expanded the company through research and innovation.",
        "financial_info": "The company grew through sustained investment in biotechnology research and business expansion.",
        "approach": "Her approach combined scientific research, business discipline and long-term investment.",
        "life_changed": "Building Biocon created opportunities to work at the intersection of science, healthcare and entrepreneurship.",
        "failures": "The early biotechnology environment presented challenges including limited infrastructure, funding difficulties and market uncertainty.",
        "lessons": "Long-term vision, scientific knowledge and persistence can help build businesses in emerging industries.",
        "tags": "business, biotechnology, entrepreneurship, leadership, india, innovation",
    },
    {
        "title": "Narayana Murthy: Building Infosys Through Technology and Discipline",
        "description": "Narayana Murthy helped build Infosys into a major technology company while emphasizing professionalism, transparency and disciplined execution.",
        "category": "Business",
        "storyteller": "Narayana Murthy",
        "storyteller_email": "",
        "starting_point": "He began his professional journey as an engineer and later became an entrepreneur.",
        "how_started": "He and his co-founders established Infosys with a focus on software services and global clients.",
        "financial_info": "The company grew by developing technology services and expanding its international customer base.",
        "approach": "The business focused on professional processes, technology expertise and long-term customer relationships.",
        "life_changed": "Entrepreneurship gave him the opportunity to help create a global technology organization from India.",
        "failures": "The early years involved limited resources, infrastructure challenges and uncertainty in the technology market.",
        "lessons": "Strong processes, integrity and consistent execution can support sustainable business growth.",
        "tags": "business, technology, infosys, entrepreneurship, leadership, india",
    },
    {
        "title": "Falguni Nayar: From Investment Banking to Nykaa",
        "description": "Falguni Nayar moved from investment banking into entrepreneurship and built Nykaa into a prominent beauty and lifestyle platform.",
        "category": "Business",
        "storyteller": "Falguni Nayar",
        "storyteller_email": "",
        "starting_point": "She had an established career in investment banking before entering entrepreneurship.",
        "how_started": "She identified an opportunity in India's growing beauty and personal care market.",
        "financial_info": "The company invested in technology, logistics, product selection and brand development.",
        "approach": "The business combined online commerce, strong branding and customer-focused product selection.",
        "life_changed": "The transition from banking to entrepreneurship created a completely new professional journey.",
        "failures": "Building a new consumer platform required overcoming competition, logistics challenges and changing customer expectations.",
        "lessons": "Industry experience can become valuable when combined with the courage to pursue a new opportunity.",
        "tags": "business, nykaa, entrepreneurship, women, leadership, india",
    },
    {
        "title": "Ritesh Agarwal: Starting OYO with a Focus on Hospitality",
        "description": "Ritesh Agarwal started OYO with the idea of improving consistency and accessibility in budget accommodation.",
        "category": "Business",
        "storyteller": "Ritesh Agarwal",
        "storyteller_email": "",
        "starting_point": "He developed an interest in entrepreneurship at a young age and explored opportunities in hospitality.",
        "how_started": "He began by studying customer experiences in budget hotels and identifying gaps in service quality.",
        "financial_info": "The company expanded by investing in technology, hotel partnerships and operational systems.",
        "approach": "The approach focused on technology, standardized experiences and a large network of accommodation partners.",
        "life_changed": "Entrepreneurship turned an early interest in travel and hospitality into a technology-led business journey.",
        "failures": "Rapid expansion created operational, financial and partner-management challenges.",
        "lessons": "Growth needs to be supported by strong operations, customer understanding and sustainable execution.",
        "tags": "business, oyo, startup, entrepreneurship, hospitality, technology",
    },
    {
        "title": "Indra Nooyi: Leadership and Global Business",
        "description": "Indra Nooyi developed a global corporate career and eventually became the CEO of PepsiCo, demonstrating the importance of strategic thinking and leadership.",
        "category": "Business",
        "storyteller": "Indra Nooyi",
        "storyteller_email": "",
        "starting_point": "She began her career in India before pursuing management education and building an international career.",
        "how_started": "She moved through strategy and leadership roles across major organizations.",
        "financial_info": "Her corporate work involved strategic decisions affecting large global businesses and product portfolios.",
        "approach": "She emphasized long-term strategy, business transformation and leadership development.",
        "life_changed": "Her international career opened opportunities to lead a major global organization.",
        "failures": "Leadership involved difficult decisions, organizational challenges and balancing short-term and long-term priorities.",
        "lessons": "Strategic thinking and continuous learning are important for leadership in global organizations.",
        "tags": "business, leadership, career, strategy, global, success",
    },

    {
        "title": "Satya Nadella: Growing Through Continuous Learning",
        "description": "Satya Nadella developed a long technology career and eventually became CEO of Microsoft, emphasizing learning, empathy and organizational transformation.",
        "category": "Job",
        "storyteller": "Satya Nadella",
        "storyteller_email": "",
        "starting_point": "He studied engineering and later pursued education and career opportunities in technology and management.",
        "how_started": "He joined Microsoft and progressed through multiple technology and leadership roles.",
        "financial_info": "His career developed through professional experience rather than entrepreneurship, with increasing responsibility over time.",
        "approach": "He emphasized continuous learning, collaboration, cloud technology and organizational culture.",
        "life_changed": "A long technology career eventually led to one of the highest leadership positions in the company.",
        "failures": "Career growth involved learning from difficult projects, changing technologies and organizational challenges.",
        "lessons": "Learning continuously and adapting to technological change can create long-term career opportunities.",
        "tags": "career, technology, microsoft, leadership, learning, success",
    },
    {
        "title": "Sundar Pichai: From Engineering Student to Global Technology Leader",
        "description": "Sundar Pichai built a technology career after studying engineering and management and eventually became the CEO of Alphabet.",
        "category": "Job",
        "storyteller": "Sundar Pichai",
        "storyteller_email": "",
        "starting_point": "He began with an engineering education in India before pursuing higher education abroad.",
        "how_started": "He joined Google and worked on products including Chrome before moving into broader leadership responsibilities.",
        "financial_info": "His career progressed through professional roles with increasing leadership responsibility.",
        "approach": "He focused on product development, technology and user experience.",
        "life_changed": "His technology career expanded from product work to global organizational leadership.",
        "failures": "Technology products face competition, changing user expectations and difficult strategic decisions.",
        "lessons": "Strong technical foundations combined with communication and leadership can create career growth.",
        "tags": "career, technology, google, leadership, engineering, india",
    },
    {
        "title": "Mary Kom: Discipline Behind a Champion Career",
        "description": "Mary Kom developed an extraordinary boxing career through discipline, training and persistence despite significant challenges.",
        "category": "Job",
        "storyteller": "Mary Kom",
        "storyteller_email": "",
        "starting_point": "She came from a modest background and discovered boxing while developing her sporting career.",
        "how_started": "She committed to structured training and competitive boxing.",
        "financial_info": "Her professional journey developed through sporting achievements, competitions and associated opportunities.",
        "approach": "Her approach centered on training discipline, physical preparation and mental resilience.",
        "life_changed": "Sport transformed her professional opportunities and public profile.",
        "failures": "Competitive sport involved defeats, injuries, training difficulties and the challenge of returning after breaks.",
        "lessons": "Consistent practice and discipline are essential when developing expertise.",
        "tags": "career, sports, discipline, boxing, success, india",
    },
    {
        "title": "P. V. Sindhu: Building a Career Through Consistent Training",
        "description": "P. V. Sindhu developed into an international badminton champion through years of structured training and competitive experience.",
        "category": "Job",
        "storyteller": "P. V. Sindhu",
        "storyteller_email": "",
        "starting_point": "She began badminton training at a young age and committed to professional development.",
        "how_started": "Regular coaching and participation in competitions helped build her professional career.",
        "financial_info": "Her sporting career created opportunities through competitions, sponsorships and professional representation.",
        "approach": "The approach relied on structured practice, fitness and competitive preparation.",
        "life_changed": "International success created a professional career in sport and broader opportunities.",
        "failures": "Losses and difficult matches became part of the process of improving performance.",
        "lessons": "Progress often comes from repeated practice, reviewing mistakes and maintaining discipline.",
        "tags": "career, badminton, sports, discipline, olympics, success",
    },
    {
        "title": "A. P. J. Abdul Kalam: Learning, Science and Public Service",
        "description": "A. P. J. Abdul Kalam developed a career in aerospace and scientific research before becoming a widely respected public figure.",
        "category": "Job",
        "storyteller": "A. P. J. Abdul Kalam",
        "storyteller_email": "",
        "starting_point": "He came from a modest family and developed an early interest in science and learning.",
        "how_started": "He pursued aerospace engineering and joined India's scientific research programs.",
        "financial_info": "His career was based on scientific and public service roles rather than private entrepreneurship.",
        "approach": "He emphasized education, scientific research, teamwork and national development.",
        "life_changed": "His scientific career eventually expanded into public service and educational outreach.",
        "failures": "Scientific programs included technical setbacks and projects that required repeated experimentation.",
        "lessons": "Curiosity, education and persistence can create meaningful long-term professional impact.",
        "tags": "career, science, engineering, education, leadership, india",
    },

    {
        "title": "Warren Buffett: The Power of Long-Term Investing",
        "description": "Warren Buffett developed an investment philosophy centered on understanding businesses, valuation and long-term ownership.",
        "category": "Investment",
        "storyteller": "Warren Buffett",
        "storyteller_email": "",
        "starting_point": "He developed an interest in business and investing at a young age.",
        "how_started": "He studied businesses and gradually developed a value-oriented investment approach.",
        "financial_info": "His investment career involved allocating capital to businesses he considered financially strong and understandable.",
        "approach": "The approach emphasizes long-term thinking, business fundamentals and disciplined decision-making.",
        "life_changed": "Investing became the central focus of his professional career.",
        "failures": "Some investments did not perform as expected, demonstrating that even disciplined investors make mistakes.",
        "lessons": "Understanding what you own and maintaining a long-term perspective can be important in investing.",
        "tags": "investment, stocks, value investing, finance, business, success",
    },
    {
        "title": "Rakesh Jhunjhunwala: Patience and Conviction in Investing",
        "description": "Rakesh Jhunjhunwala became known for his long-term participation in Indian equity markets and his interest in businesses with growth potential.",
        "category": "Investment",
        "storyteller": "Rakesh Jhunjhunwala",
        "storyteller_email": "",
        "starting_point": "He developed an interest in financial markets and began participating in the Indian stock market.",
        "how_started": "He studied companies and invested with a long-term perspective.",
        "financial_info": "His investment journey involved equity investments and portfolio management.",
        "approach": "His approach included studying businesses, accepting market volatility and maintaining conviction.",
        "life_changed": "Investing became his primary professional activity and public identity.",
        "failures": "Market cycles and individual investment decisions created periods of losses and uncertainty.",
        "lessons": "Investing requires patience, research and awareness that markets can move unpredictably.",
        "tags": "investment, stocks, finance, india, markets, patience",
    },
    {
        "title": "Peter Lynch: Finding Investment Ideas in Everyday Businesses",
        "description": "Peter Lynch became known for studying businesses closely and looking for investment opportunities in companies with understandable growth stories.",
        "category": "Investment",
        "storyteller": "Peter Lynch",
        "storyteller_email": "",
        "starting_point": "He developed a career in finance and investment management.",
        "how_started": "He analyzed companies across many industries while managing investment portfolios.",
        "financial_info": "His professional work involved researching and managing equity investments.",
        "approach": "He emphasized understanding businesses, researching companies and maintaining diversification.",
        "life_changed": "Investment management became his central professional career.",
        "failures": "Not every company analysis worked as expected, making research and risk management essential.",
        "lessons": "Investors should understand businesses rather than relying only on market excitement.",
        "tags": "investment, stocks, finance, research, business, markets",
    },
    {
        "title": "Benjamin Graham: The Foundations of Value Investing",
        "description": "Benjamin Graham developed influential ideas around value investing, margin of safety and disciplined analysis of financial information.",
        "category": "Investment",
        "storyteller": "Benjamin Graham",
        "storyteller_email": "",
        "starting_point": "He developed his career in finance and securities analysis.",
        "how_started": "He studied companies and developed methods for evaluating securities based on financial fundamentals.",
        "financial_info": "His work focused on analyzing the financial value and risks associated with investments.",
        "approach": "The approach emphasized valuation, margin of safety and disciplined decision-making.",
        "life_changed": "His work influenced generations of investors and financial analysts.",
        "failures": "Market downturns demonstrated the importance of risk management and protecting capital.",
        "lessons": "Investment decisions should account for price, value and the possibility of unexpected outcomes.",
        "tags": "investment, value investing, finance, stocks, research, risk",
    },

    {
        "title": "Cristiano Ronaldo: Discipline Behind a Football Career",
        "description": "Cristiano Ronaldo developed from a young footballer into an internationally recognized professional through training, competition and discipline.",
        "category": "Other",
        "storyteller": "Cristiano Ronaldo",
        "storyteller_email": "",
        "starting_point": "He began playing football at a young age and moved from Madeira into professional development.",
        "how_started": "Youth football and professional training created opportunities to compete at increasingly higher levels.",
        "financial_info": "His professional sporting career created income through clubs, sponsorships and commercial activities.",
        "approach": "His career has emphasized fitness, training, recovery and continuous performance improvement.",
        "life_changed": "Professional football transformed his career and international profile.",
        "failures": "Sport involves defeats, injuries, difficult matches and periods of criticism.",
        "lessons": "Consistent preparation and willingness to improve can support long-term performance.",
        "tags": "sports, football, discipline, career, success, leadership",
    },
    {
        "title": "Michael Phelps: Training for Excellence in Swimming",
        "description": "Michael Phelps built an extraordinary swimming career through structured training, competition and a long-term commitment to performance.",
        "category": "Other",
        "storyteller": "Michael Phelps",
        "storyteller_email": "",
        "starting_point": "He started swimming as a child and developed his abilities through competitive training.",
        "how_started": "Regular coaching and international competition helped him progress into elite swimming.",
        "financial_info": "His professional sporting career included competition opportunities and sponsorships.",
        "approach": "Training, recovery, technique and competition preparation formed the core of his approach.",
        "life_changed": "Swimming became a professional career and brought international recognition.",
        "failures": "Competitive swimming includes losses, difficult races and the pressure of maintaining elite performance.",
        "lessons": "Small improvements repeated over time can contribute to exceptional performance.",
        "tags": "sports, swimming, olympics, discipline, career, success",
    },
        {
        "title": "Ratan Tata: Leadership, Trust and Long-Term Thinking",
        "description": "Ratan Tata led the Tata Group through a period of significant expansion while maintaining a strong emphasis on trust, innovation and long-term business thinking.",
        "category": "Business",
        "storyteller": "Ratan Tata",
        "storyteller_email": "",
        "starting_point": "He joined the Tata Group after completing his education and gradually took on broader responsibilities within the organization.",
        "how_started": "He worked across different parts of the group and eventually became chairman, helping guide major strategic initiatives.",
        "financial_info": "The group's businesses expanded through investments, acquisitions and development of new products and markets.",
        "approach": "His leadership emphasized long-term value, innovation, reputation and responsible business practices.",
        "life_changed": "Corporate leadership provided an opportunity to influence businesses across multiple industries.",
        "failures": "Major business decisions involved uncertainty, integration challenges and projects that did not always produce the expected results.",
        "lessons": "Leadership involves balancing business growth with long-term trust, responsibility and adaptability.",
        "tags": "business, tata, leadership, india, innovation, strategy, success",
    },
    {
        "title": "Amitabh Bachchan: Reinventing a Long Career",
        "description": "Amitabh Bachchan built a long career in Indian cinema and demonstrated the importance of adapting to changing opportunities and professional circumstances.",
        "category": "Other",
        "storyteller": "Amitabh Bachchan",
        "storyteller_email": "",
        "starting_point": "He entered the film industry after completing his education and initially faced difficulties finding consistent opportunities.",
        "how_started": "Acting roles gradually established his reputation and created opportunities for larger projects.",
        "financial_info": "His professional career developed through films, television and other entertainment opportunities.",
        "approach": "He adapted to changing formats and audiences while continuing to develop his professional skills.",
        "life_changed": "A long entertainment career created opportunities across several generations of Indian media.",
        "failures": "Career setbacks and periods of reduced opportunities required adaptation and persistence.",
        "lessons": "Professional reinvention can help sustain a career when industries, audiences and opportunities change.",
        "tags": "career, entertainment, india, success, discipline, reinvention",
    },
    {
        "title": "Dr. A. S. Kiran Kumar: A Career in Space Science",
        "description": "Dr. A. S. Kiran Kumar developed a long career in India's space program, contributing to satellite and space technology projects.",
        "category": "Job",
        "storyteller": "A. S. Kiran Kumar",
        "storyteller_email": "",
        "starting_point": "He developed an interest in science and engineering and pursued education in physics and electronics.",
        "how_started": "He joined India's space program and worked on satellite-related technologies and scientific missions.",
        "financial_info": "His career developed through professional scientific and engineering roles within India's space organization.",
        "approach": "The work required technical knowledge, teamwork, experimentation and careful project execution.",
        "life_changed": "A career in space science created opportunities to contribute to major national technology programs.",
        "failures": "Space missions involve technical risks, testing challenges and the possibility of unsuccessful outcomes.",
        "lessons": "Scientific careers require patience, technical depth, teamwork and learning from every project.",
        "tags": "career, science, engineering, space, technology, india, learning",
    }
]


def main():
    database_url = os.getenv("DATABASE_URL", "")

    if "localhost" not in database_url and "127.0.0.1" not in database_url:
        raise RuntimeError(
            "SAFETY STOP: DATABASE_URL does not point to localhost. "
            "This script only runs against a local database."
        )

    with app.app_context():
        existing_titles = {
            post.title
            for post in Post.query.all()
        }

        added = 0

        for story in stories:
            if story["title"] in existing_titles:
                continue

            post = Post(**story)

            db.session.add(post)
            added += 1

        db.session.commit()

        total = Post.query.count()

        print(f"Added {added} stories.")
        print(f"Total stories in local database: {total}")


if __name__ == "__main__":
    main()