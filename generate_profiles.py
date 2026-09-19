import json

profiles = [
    {
        "id": "p01",
        "name": "Ananya Rao",
        "current_title": "Senior Backend Engineer",
        "years_experience": 6,
        "location": "Bangalore",
        "current_company": "NimbusPay",
        "current_company_type": "startup",
        "skills": ["Node.js", "PostgreSQL", "AWS RDS", "Redis", "TypeScript"],
        "past_companies": [
            {"company": "Zeta", "company_type": "scaleup", "title": "Backend Engineer", "years": 3}
        ],
        "education": "B.E. Computer Science, BITS Pilani",
        "summary": "Backend engineer who has spent most of her career building payments infrastructure at early-stage startups."
    },
    {
        "id": "p02",
        "name": "Rohan Mehta",
        "current_title": "Backend Developer",
        "years_experience": 5,
        "location": "Bangalore",
        "current_company": "KredX",
        "current_company_type": "scaleup",
        "skills": ["Python", "Django", "AWS RDS", "PostgreSQL", "Docker"],
        "past_companies": [
            {"company": "QuickBite", "company_type": "startup", "title": "Junior Developer", "years": 2}
        ],
        "education": "B.Tech Computer Science, NIT Karnataka",
        "summary": "Full-stack capable backend specialist with strong relational database modeling and RDS management skills."
    },
    {
        "id": "p03",
        "name": "Kavita Nair",
        "current_title": "Lead Platform Engineer",
        "years_experience": 8,
        "location": "Bangalore",
        "current_company": "CloudNative Labs",
        "current_company_type": "startup",
        "skills": ["Go", "Kubernetes", "AWS RDS", "Terraform", "PostgreSQL", "Kafka"],
        "past_companies": [
            {"company": "Infosys", "company_type": "enterprise", "title": "Systems Engineer", "years": 3},
            {"company": "Ola", "company_type": "scaleup", "title": "Senior Engineer", "years": 3}
        ],
        "education": "M.Tech Software Engineering, IIT Madras",
        "summary": "Platform architect focused on cloud-native infra and highly available multi-region databases on AWS."
    },
    {
        "id": "p04",
        "name": "Siddharth Verma",
        "current_title": "Software Engineer II",
        "years_experience": 3,
        "location": "Bangalore",
        "current_company": "HyperGro",
        "current_company_type": "startup",
        "skills": ["Node.js", "AWS RDS", "MongoDB", "Express", "TypeScript"],
        "past_companies": [],
        "education": "B.E. Information Technology, RV College of Engineering",
        "summary": "Fast-moving early career engineer with 3 years building commerce APIs with RDS and DynamoDB."
    },
    {
        "id": "p05",
        "name": "Pooja Hegde",
        "current_title": "Senior Database Administrator / RDS Specialist",
        "years_experience": 7,
        "location": "Bangalore",
        "current_company": "FintechOne",
        "current_company_type": "startup",
        "skills": ["AWS RDS", "PostgreSQL", "MySQL", "Aurora", "Performance Tuning", "Python"],
        "past_companies": [
            {"company": "TCS", "company_type": "enterprise", "title": "DBA", "years": 3}
        ],
        "education": "B.Tech Computer Science, Manipal Institute of Technology",
        "summary": "DBA turned backend engineer who loves query optimization, read replicas, and zero-downtime migrations."
    },
    {
        "id": "p06",
        "name": "Vikram Malhotra",
        "current_title": "Staff Backend Engineer",
        "years_experience": 11,
        "location": "Bangalore",
        "current_company": "Oracle India",
        "current_company_type": "enterprise",
        "skills": ["Java", "Spring Boot", "Oracle DB", "AWS RDS", "Microservices"],
        "past_companies": [
            {"company": "Wipro", "company_type": "enterprise", "title": "Developer", "years": 4}
        ],
        "education": "B.Tech CSE, IIT Roorkee",
        "summary": "Enterprise database and backend veteran with over a decade of architecting large systems."
    },
    {
        "id": "p07",
        "name": "Aditi Joshi",
        "current_title": "Full Stack Engineer",
        "years_experience": 5,
        "location": "Mumbai",
        "current_company": "Credilio",
        "current_company_type": "startup",
        "skills": ["React", "Node.js", "AWS RDS", "PostgreSQL", "GraphQL"],
        "past_companies": [
            {"company": "WebSpiders", "company_type": "agency", "title": "Web Developer", "years": 2}
        ],
        "education": "B.E. Computer Science, Mumbai University",
        "summary": "Full stack engineer based in Mumbai building high-throughput lending web apps on AWS."
    },
    {
        "id": "p08",
        "name": "Nikhil Agarwal",
        "current_title": "Backend Engineer",
        "years_experience": 4,
        "location": "Bangalore",
        "current_company": "Razorpay",
        "current_company_type": "scaleup",
        "skills": ["Go", "MySQL", "AWS RDS", "Docker", "Kafka"],
        "past_companies": [
            {"company": "ShopUp", "company_type": "startup", "title": "Software Intern/Engineer", "years": 2}
        ],
        "education": "B.Tech Computer Science, PES University Bangalore",
        "summary": "High-velocity backend developer working on real-time transaction processing and distributed ledgers."
    },
    {
        "id": "p09",
        "name": "Meera Krishnan",
        "current_title": "Senior Backend Developer",
        "years_experience": 6,
        "location": "Bangalore",
        "current_company": "Freshworks",
        "current_company_type": "scaleup",
        "skills": ["Ruby on Rails", "PostgreSQL", "AWS RDS", "Sidekiq", "Redis"],
        "past_companies": [
            {"company": "UrbanPiper", "company_type": "startup", "title": "Backend Dev", "years": 3}
        ],
        "education": "B.Tech IT, PSG Tech Coimbatore",
        "summary": "Rails and PostgreSQL veteran who led database partitioning and performance tuning at seed and series B startups."
    },
    {
        "id": "p10",
        "name": "Arjun Singhal",
        "current_title": "Frontend Engineer",
        "years_experience": 5,
        "location": "Bangalore",
        "current_company": "Swiggy",
        "current_company_type": "scaleup",
        "skills": ["React", "TypeScript", "Next.js", "Redux", "Tailwind CSS"],
        "past_companies": [
            {"company": "PixelCraft", "company_type": "agency", "title": "UI Developer", "years": 2}
        ],
        "education": "B.E. Computer Science, Delhi Technological University",
        "summary": "Product-oriented frontend engineer obsessed with design systems and web performance."
    },
    {
        "id": "p11",
        "name": "Tanvi Saxena",
        "current_title": "Backend Engineer",
        "years_experience": 4,
        "location": "Bangalore",
        "current_company": "Dukaan",
        "current_company_type": "startup",
        "skills": ["Python", "FastAPI", "AWS RDS", "PostgreSQL", "Celery"],
        "past_companies": [
            {"company": "Mindtree", "company_type": "enterprise", "title": "Software Engineer", "years": 1.5}
        ],
        "education": "B.Tech CSE, SRM University",
        "summary": "Product builder passionate about fast prototyping with FastAPI and robust relational data architecture on RDS."
    },
    {
        "id": "p12",
        "name": "Gaurav Sen",
        "current_title": "Data Engineer",
        "years_experience": 6,
        "location": "Bangalore",
        "current_company": "Bounce",
        "current_company_type": "scaleup",
        "skills": ["Python", "Spark", "AWS RDS", "Airflow", "Snowflake", "PostgreSQL"],
        "past_companies": [
            {"company": "MuSigma", "company_type": "enterprise", "title": "Decision Scientist", "years": 2.5}
        ],
        "education": "B.Tech Electrical, IIT BHU",
        "summary": "Pipelines and ETL specialist who synchronizes production RDS instances with data lakes and analytical warehouses."
    },
    {
        "id": "p13",
        "name": "Deepak Chawla",
        "current_title": "Backend Consultant",
        "years_experience": 7,
        "location": "Bangalore",
        "current_company": "Appinventiv",
        "current_company_type": "agency",
        "skills": ["Node.js", "AWS RDS", "PostgreSQL", "Docker", "Express"],
        "past_companies": [
            {"company": "Mindbowser", "company_type": "agency", "title": "Backend Developer", "years": 3}
        ],
        "education": "B.Tech IT, Jaypee Institute of Information Technology",
        "summary": "Agency veteran who has shipped 20+ client projects with AWS RDS databases and Express backends."
    },
    {
        "id": "p14",
        "name": "Shreya Ghosh",
        "current_title": "Senior Software Engineer",
        "years_experience": 5,
        "location": "Remote",
        "current_company": "GitPod Labs",
        "current_company_type": "startup",
        "skills": ["Go", "AWS RDS", "PostgreSQL", "gRPC", "Docker"],
        "past_companies": [
            {"company": "Postman", "company_type": "scaleup", "title": "Backend Engineer", "years": 2.5}
        ],
        "education": "B.Tech CSE, Jadavpur University",
        "summary": "Remote-first backend engineer specializing in microservices, distributed caching, and RDS replication."
    },
    {
        "id": "p15",
        "name": "Prateek Bansal",
        "current_title": "DevOps Engineer",
        "years_experience": 6,
        "location": "Bangalore",
        "current_company": "Groww",
        "current_company_type": "scaleup",
        "skills": ["Terraform", "AWS RDS", "Kubernetes", "CI/CD", "Prometheus"],
        "past_companies": [
            {"company": "Accenture", "company_type": "enterprise", "title": "Cloud Analyst", "years": 2}
        ],
        "education": "B.E. Computer Science, Thapar University",
        "summary": "Cloud infrastructure engineer automating AWS RDS provisioning, failover mechanisms, and security scanning."
    },
    {
        "id": "p16",
        "name": "Divya Deshmukh",
        "current_title": "Senior Backend Engineer",
        "years_experience": 7,
        "location": "Bangalore",
        "current_company": "Playment",
        "current_company_type": "startup",
        "skills": ["Python", "Django", "PostgreSQL", "AWS RDS", "Redis", "Celery"],
        "past_companies": [
            {"company": "InMobi", "company_type": "scaleup", "title": "Software Engineer", "years": 3}
        ],
        "education": "B.Tech CSE, COEP Pune",
        "summary": "7 years building high-load data labeling pipelines with heavy reliance on Postgres on AWS RDS."
    },
    {
        "id": "p17",
        "name": "Varun Kapoor",
        "current_title": "Software Engineer - Backend",
        "years_experience": 4,
        "location": "Delhi NCR",
        "current_company": "Zomato",
        "current_company_type": "scaleup",
        "skills": ["Java", "Spring Boot", "MySQL", "AWS RDS", "Kafka"],
        "past_companies": [
            {"company": "Paytm", "company_type": "enterprise", "title": "Software Engineer", "years": 2}
        ],
        "education": "B.Tech CSE, NSUT Delhi",
        "summary": "Backend engineer skilled in handling transactional spikes and RDS replication lag for delivery dispatch systems."
    },
    {
        "id": "p18",
        "name": "Sneha Kulkarni",
        "current_title": "Full Stack Engineer",
        "years_experience": 6,
        "location": "Bangalore",
        "current_company": "Fashinza",
        "current_company_type": "startup",
        "skills": ["Node.js", "React", "AWS RDS", "PostgreSQL", "TypeScript"],
        "past_companies": [
            {"company": "Cognizant", "company_type": "enterprise", "title": "Programmer Analyst", "years": 2}
        ],
        "education": "B.E. Information Science, BMS College of Engineering",
        "summary": "Product engineer thriving in fast-paced B2B startup environments with strong hands-on full-stack skills."
    },
    {
        "id": "p19",
        "name": "Manish Tiwari",
        "current_title": "Backend Developer",
        "years_experience": 2,
        "location": "Bangalore",
        "current_company": "Stealth AI",
        "current_company_type": "startup",
        "skills": ["Python", "FastAPI", "AWS RDS", "PostgreSQL"],
        "past_companies": [],
        "education": "B.Tech CSE, IIIT Allahabad",
        "summary": "Enthusiastic junior backend engineer building AI agent workflows and PostgreSQL persistence layers."
    },
    {
        "id": "p20",
        "name": "Ayesha Khan",
        "current_title": "Staff Engineer - Core Database",
        "years_experience": 10,
        "location": "Hyderabad",
        "current_company": "Microsoft",
        "current_company_type": "enterprise",
        "skills": ["C++", "Azure SQL", "PostgreSQL", "Distributed Systems", "Python"],
        "past_companies": [
            {"company": "Amazon", "company_type": "enterprise", "title": "SDE II", "years": 4}
        ],
        "education": "M.S. Computer Science, Georgia Tech",
        "summary": "Database engine developer with profound internal knowledge of storage engines, query planners, and B-trees."
    },
    {
        "id": "p21",
        "name": "Rajesh Kannan",
        "current_title": "Senior Backend Engineer",
        "years_experience": 5,
        "location": "Bangalore",
        "current_company": "Hasura",
        "current_company_type": "startup",
        "skills": ["Haskell", "Go", "PostgreSQL", "AWS RDS", "GraphQL"],
        "past_companies": [
            {"company": "Chargebee", "company_type": "scaleup", "title": "Software Engineer", "years": 2.5}
        ],
        "education": "B.Tech CSE, NIT Trichy",
        "summary": "Database tooling enthusiast with expertise in Postgres internals, RDS hosting, and instant GraphQL APIs."
    },
    {
        "id": "p22",
        "name": "Priyanka Patel",
        "current_title": "Lead Software Engineer",
        "years_experience": 7,
        "location": "Bangalore",
        "current_company": "Jupiter Money",
        "current_company_type": "startup",
        "skills": ["Java", "Kotlin", "AWS RDS", "PostgreSQL", "Spring Cloud", "Kafka"],
        "past_companies": [
            {"company": "Capgemini", "company_type": "enterprise", "title": "Consultant", "years": 3}
        ],
        "education": "B.E. Computer Science, VJTI Mumbai",
        "summary": "Fintech architect who designed core banking integrations and compliant encrypted RDS storage."
    },
    {
        "id": "p23",
        "name": "Karthik Raja",
        "current_title": "Backend Engineer",
        "years_experience": 4,
        "location": "Bangalore",
        "current_company": "Urban Company",
        "current_company_type": "scaleup",
        "skills": ["Node.js", "MongoDB", "Redis", "TypeScript", "AWS"],
        "past_companies": [
            {"company": "Zoho", "company_type": "enterprise", "title": "Member Technical Staff", "years": 2}
        ],
        "education": "B.E. ECE, Anna University",
        "summary": "High-throughput API engineer with a focus on NoSQL and real-time socket connections. Light on RDS."
    },
    {
        "id": "p24",
        "name": "Ankit Srivastava",
        "current_title": "Senior Backend Developer",
        "years_experience": 6,
        "location": "Bangalore",
        "current_company": "Khatabook",
        "current_company_type": "startup",
        "skills": ["Go", "PostgreSQL", "AWS RDS", "Docker", "Redis"],
        "past_companies": [
            {"company": "CleverTap", "company_type": "scaleup", "title": "Software Engineer", "years": 3}
        ],
        "education": "B.Tech CSE, IIIT Delhi",
        "summary": "Reliability-first backend developer with 6 years experience in hyper-growth startups using AWS RDS."
    },
    {
        "id": "p25",
        "name": "Harsh Vardhan",
        "current_title": "Backend Engineer",
        "years_experience": 5,
        "location": "Pune",
        "current_company": "PubMatic",
        "current_company_type": "enterprise",
        "skills": ["Java", "C++", "MySQL", "AWS RDS", "Kafka"],
        "past_companies": [
            {"company": "Cybage", "company_type": "agency", "title": "Software Engineer", "years": 2}
        ],
        "education": "B.E. IT, Pune Institute of Computer Technology",
        "summary": "Adtech backend developer handling ultra low-latency bidding engines and RDS database clusters."
    },
    {
        "id": "p26",
        "name": "Ritu Sen",
        "current_title": "Senior Full Stack Engineer",
        "years_experience": 6,
        "location": "Bangalore",
        "current_company": "Smallcase",
        "current_company_type": "startup",
        "skills": ["Node.js", "PostgreSQL", "AWS RDS", "Vue.js", "AWS Lambda"],
        "past_companies": [
            {"company": "MuSigma", "company_type": "enterprise", "title": "Trainee", "years": 1},
            {"company": "Instamojo", "company_type": "startup", "title": "Frontend Engineer", "years": 2}
        ],
        "education": "B.Tech IT, KIIT Bhubaneswar",
        "summary": "Fintech product engineer who bridged frontend interactions with serverless and RDS backend services."
    },
    {
        "id": "p27",
        "name": "Sameer Joshi",
        "current_title": "Principal Architect",
        "years_experience": 12,
        "location": "Bangalore",
        "current_company": "Ola Electric",
        "current_company_type": "scaleup",
        "skills": ["Go", "Python", "AWS RDS", "Kubernetes", "Cassandra", "Kafka"],
        "past_companies": [
            {"company": "Cisco", "company_type": "enterprise", "title": "Software Engineer", "years": 5},
            {"company": "Flipkart", "company_type": "scaleup", "title": "Staff Architect", "years": 4}
        ],
        "education": "M.Tech CSE, IIT Bombay",
        "summary": "Seasoned architect designing telemetry processing systems with hybrid storage across RDS and Cassandra."
    },
    {
        "id": "p28",
        "name": "Isha Madan",
        "current_title": "Backend Engineer",
        "years_experience": 4,
        "location": "Bangalore",
        "current_company": "Jar",
        "current_company_type": "startup",
        "skills": ["Python", "FastAPI", "AWS RDS", "PostgreSQL", "Redis"],
        "past_companies": [
            {"company": "Sutra Services", "company_type": "agency", "title": "Junior Developer", "years": 1.5}
        ],
        "education": "B.Tech CSE, Manipal University Jaipur",
        "summary": "Startup builder passionate about daily micro-savings applications, transactional integrity, and RDS read tuning."
    },
    {
        "id": "p29",
        "name": "Amitabh Roy",
        "current_title": "Senior Systems Engineer",
        "years_experience": 7,
        "location": "Kolkata",
        "current_company": "PwC India",
        "current_company_type": "enterprise",
        "skills": ["Java", "Oracle", "AWS RDS", "Spring Boot", "Microservices"],
        "past_companies": [
            {"company": "Wipro", "company_type": "enterprise", "title": "Associate", "years": 3}
        ],
        "education": "B.Tech CSE, Heritage Institute of Technology",
        "summary": "Enterprise solutions architect with solid AWS migration credentials, primarily working with Fortune 500 clients."
    },
    {
        "id": "p30",
        "name": "Kunal Bhasin",
        "current_title": "Founding Backend Engineer",
        "years_experience": 5,
        "location": "Bangalore",
        "current_company": "Loop Health",
        "current_company_type": "startup",
        "skills": ["TypeScript", "Node.js", "PostgreSQL", "AWS RDS", "GraphQL", "Docker"],
        "past_companies": [
            {"company": "CureFit", "company_type": "scaleup", "title": "SDE 1", "years": 2}
        ],
        "education": "B.Tech CSE, BITS Goa",
        "summary": "Founding engineer experienced in building healthcare compliance workflows on AWS RDS Postgres from 0 to 1."
    },
    {
        "id": "p31",
        "name": "Nandini Pillai",
        "current_title": "Backend Engineer",
        "years_experience": 5,
        "location": "Bangalore",
        "current_company": "Licious",
        "current_company_type": "scaleup",
        "skills": ["Java", "Spring Boot", "AWS RDS", "MySQL", "AWS SQS"],
        "past_companies": [
            {"company": "Infosys", "company_type": "enterprise", "title": "Software Engineer", "years": 2}
        ],
        "education": "B.E. CSE, College of Engineering Guindy",
        "summary": "Inventory and supply chain backend engineer with strong expertise in relational consistency and RDS triggers."
    },
    {
        "id": "p32",
        "name": "Abhishek Nambiar",
        "current_title": "Cloud Architect",
        "years_experience": 9,
        "location": "Bangalore",
        "current_company": "Thoughtworks",
        "current_company_type": "agency",
        "skills": ["AWS RDS", "Terraform", "Go", "Python", "Kubernetes", "Architecture"],
        "past_companies": [
            {"company": "Mindtree", "company_type": "enterprise", "title": "Senior Consultant", "years": 4}
        ],
        "education": "B.Tech IT, NIT Calicut",
        "summary": "Consultancy tech lead helping international clients modernize their relational database tiers to AWS Aurora and RDS."
    },
    {
        "id": "p33",
        "name": "Tara Sundaram",
        "current_title": "Senior Backend Developer",
        "years_experience": 6,
        "location": "Bangalore",
        "current_company": "Postman",
        "current_company_type": "scaleup",
        "skills": ["Node.js", "PostgreSQL", "AWS RDS", "Redis", "Docker"],
        "past_companies": [
            {"company": "SquadStack", "company_type": "startup", "title": "Backend Dev", "years": 3}
        ],
        "education": "B.E. Computer Science, PESIT Bangalore",
        "summary": "API performance fanatic with 6 years across startup and scaleup environments, specializing in AWS RDS."
    },
    {
        "id": "p34",
        "name": "Vivek Somani",
        "current_title": "Backend Engineer",
        "years_experience": 3,
        "location": "Bangalore",
        "current_company": "Kite Health",
        "current_company_type": "startup",
        "skills": ["Python", "FastAPI", "PostgreSQL", "AWS RDS", "Docker"],
        "past_companies": [],
        "education": "B.Tech Computer Science, VIT Vellore",
        "summary": "Junior startup developer enthusiastic about building clean REST APIs and deploying PostgreSQL to AWS RDS."
    },
    {
        "id": "p35",
        "name": "Rashmi Bhat",
        "current_title": "Senior Software Engineer",
        "years_experience": 7,
        "location": "Bangalore",
        "current_company": "PhonePe",
        "current_company_type": "scaleup",
        "skills": ["Java", "HBase", "Cassandra", "Kafka", "Aerospike"],
        "past_companies": [
            {"company": "Yahoo", "company_type": "enterprise", "title": "Software Dev", "years": 3}
        ],
        "education": "B.Tech CSE, NIT Surathkal",
        "summary": "NoSQL and distributed key-value storage engineer handling millions of TPS. Limited SQL/RDS focus."
    },
    {
        "id": "p36",
        "name": "Akash Deep",
        "current_title": "Backend Engineer",
        "years_experience": 4,
        "location": "Bangalore",
        "current_company": "InVideo",
        "current_company_type": "startup",
        "skills": ["Node.js", "TypeScript", "AWS RDS", "PostgreSQL", "FFmpeg"],
        "past_companies": [
            {"company": "GeekyAnts", "company_type": "agency", "title": "Fullstack Dev", "years": 1.5}
        ],
        "education": "B.Tech IT, Guru Gobind Singh Indraprastha University",
        "summary": "Video rendering pipeline backend engineer using RDS for video metadata and project timeline states."
    },
    {
        "id": "p37",
        "name": "Monika Das",
        "current_title": "Lead Backend Engineer",
        "years_experience": 8,
        "location": "Bangalore",
        "current_company": "Zeta",
        "current_company_type": "scaleup",
        "skills": ["Java", "Kotlin", "AWS RDS", "PostgreSQL", "Distributed Systems"],
        "past_companies": [
            {"company": "Directi", "company_type": "enterprise", "title": "Software Engineer", "years": 4}
        ],
        "education": "B.E. Computer Science, Jadavpur University",
        "summary": "Fintech architect with 8 years building core banking engines, high-concurrency ledger operations, and RDS setups."
    },
    {
        "id": "p38",
        "name": "Saurabh Pandey",
        "current_title": "Senior Software Engineer",
        "years_experience": 6,
        "location": "Bangalore",
        "current_company": "DealShare",
        "current_company_type": "startup",
        "skills": ["Python", "Django", "AWS RDS", "MySQL", "Celery", "Redis"],
        "past_companies": [
            {"company": "HCL", "company_type": "enterprise", "title": "Software Engineer", "years": 2}
        ],
        "education": "B.Tech Computer Science, AKTU Lucknow",
        "summary": "6 years building social e-commerce backend platforms with high-volume database queries on AWS RDS."
    },
    {
        "id": "p39",
        "name": "Kiran Kumar",
        "current_title": "Mobile Engineer (React Native / iOS)",
        "years_experience": 5,
        "location": "Bangalore",
        "current_company": "Cult.fit",
        "current_company_type": "scaleup",
        "skills": ["React Native", "iOS", "Swift", "TypeScript", "GraphQL"],
        "past_companies": [
            {"company": "Robosoft", "company_type": "agency", "title": "iOS Dev", "years": 2}
        ],
        "education": "B.E. CSE, Mysore University",
        "summary": "Mobile app developer creating buttery smooth 60fps animations and offline-first mobile sync."
    },
    {
        "id": "p40",
        "name": "Shruti Natarajan",
        "current_title": "Senior Backend Developer",
        "years_experience": 5,
        "location": "Bangalore",
        "current_company": "Acko",
        "current_company_type": "scaleup",
        "skills": ["Go", "AWS RDS", "PostgreSQL", "Docker", "RabbitMQ"],
        "past_companies": [
            {"company": "Ninjacart", "company_type": "startup", "title": "Backend Engineer", "years": 2.5}
        ],
        "education": "B.Tech CSE, Amrita Vishwa Vidyapeetham",
        "summary": "Insurtech engineer with 5 years experience across seed stage and series D unicorns, focused on AWS RDS Postgres."
    },
    {
        "id": "p41",
        "name": "Tushar Singla",
        "current_title": "Backend Engineer",
        "years_experience": 4,
        "location": "Bangalore",
        "current_company": "Yellow.ai",
        "current_company_type": "scaleup",
        "skills": ["Node.js", "Python", "AWS RDS", "MongoDB", "Elasticsearch"],
        "past_companies": [
            {"company": "Trilogy", "company_type": "startup", "title": "Junior Dev", "years": 1.5}
        ],
        "education": "B.Tech CSE, Thapar University",
        "summary": "Chatbot platform backend developer integrating NLP pipelines with relational database session tracking on RDS."
    },
    {
        "id": "p42",
        "name": "Ananya Sen",
        "current_title": "Senior Software Engineer",
        "years_experience": 7,
        "location": "Remote",
        "current_company": "Hasura",
        "current_company_type": "startup",
        "skills": ["Go", "PostgreSQL", "AWS RDS", "Docker", "Kubernetes"],
        "past_companies": [
            {"company": "Red Hat", "company_type": "enterprise", "title": "Associate Software Engineer", "years": 2.5}
        ],
        "education": "B.E. IT, Jadavpur University",
        "summary": "Remote backend engineer building metadata engines and database connectors for Postgres on AWS."
    },
    {
        "id": "p43",
        "name": "Bhavin Shah",
        "current_title": "Backend Team Lead",
        "years_experience": 7,
        "location": "Bangalore",
        "current_company": "Rappi India Hub",
        "current_company_type": "startup",
        "skills": ["Go", "AWS RDS", "PostgreSQL", "Kafka", "Redis"],
        "past_companies": [
            {"company": "MuSigma", "company_type": "enterprise", "title": "Developer", "years": 2},
            {"company": "Trell", "company_type": "startup", "title": "Senior SDE", "years": 2.5}
        ],
        "education": "B.Tech CSE, Nirma University",
        "summary": "Experienced team lead driving database re-architecture and sharding on AWS RDS Postgres for high throughput."
    },
    {
        "id": "p44",
        "name": "Pallavi Reddy",
        "current_title": "Senior Backend Developer",
        "years_experience": 5,
        "location": "Bangalore",
        "current_company": "Open Financial Technologies",
        "current_company_type": "startup",
        "skills": ["PHP", "Laravel", "MySQL", "AWS RDS", "Docker"],
        "past_companies": [
            {"company": "Sheroes", "company_type": "startup", "title": "Web Developer", "years": 2}
        ],
        "education": "B.Tech CSE, Osmania University",
        "summary": "Fintech neo-banking developer building double-entry ledger accounts using MySQL hosted on AWS RDS."
    },
    {
        "id": "p45",
        "name": "Yashwant Rao",
        "current_title": "Principal SRE",
        "years_experience": 11,
        "location": "Bangalore",
        "current_company": "Walmart Global Tech",
        "current_company_type": "enterprise",
        "skills": ["AWS RDS", "Terraform", "Python", "Observability", "MySQL"],
        "past_companies": [
            {"company": "Target", "company_type": "enterprise", "title": "Systems Lead", "years": 5}
        ],
        "education": "B.Tech Electrical, NIT Warangal",
        "summary": "Enterprise reliability engineer specializing in disaster recovery, multi-region RDS backups, and automated failover."
    },
    {
        "id": "p46",
        "name": "Sakshi Chhabra",
        "current_title": "Full Stack Engineer",
        "years_experience": 4,
        "location": "Bangalore",
        "current_company": "Kodo Card",
        "current_company_type": "startup",
        "skills": ["Node.js", "React", "PostgreSQL", "AWS RDS", "TypeScript"],
        "past_companies": [
            {"company": "Wipro", "company_type": "enterprise", "title": "Project Engineer", "years": 1.5}
        ],
        "education": "B.Tech CSE, Delhi Technological University",
        "summary": "Fintech full-stack engineer passionate about building card issuing dashboards and secure AWS RDS databases."
    },
    {
        "id": "p47",
        "name": "Hemant Gupta",
        "current_title": "Senior Backend Engineer",
        "years_experience": 6,
        "location": "Bangalore",
        "current_company": "Stanza Living",
        "current_company_type": "scaleup",
        "skills": ["Python", "FastAPI", "PostgreSQL", "AWS RDS", "Docker"],
        "past_companies": [
            {"company": "OYO", "company_type": "scaleup", "title": "SDE 1", "years": 2},
            {"company": "Wittyfeed", "company_type": "startup", "title": "Software Intern", "years": 1}
        ],
        "education": "B.Tech CSE, SGSITS Indore",
        "summary": "FastAPI and PostgreSQL specialist with 6 years experience in hyper-growth startups handling property booking flows."
    },
    {
        "id": "p48",
        "name": "Ananya Varma",
        "current_title": "Junior Backend Developer",
        "years_experience": 1,
        "location": "Bangalore",
        "current_company": "NeatWork",
        "current_company_type": "startup",
        "skills": ["Python", "Flask", "SQLite", "Git"],
        "past_companies": [],
        "education": "B.E. CSE, RV College of Engineering",
        "summary": "Recent graduate eager to learn cloud architectures and backend relational databases."
    }
]

with open("backend/data/profiles.json", "w", encoding="utf-8") as f:
    json.dump(profiles, f, indent=2)

with open("profiles.json", "w", encoding="utf-8") as f:
    json.dump(profiles, f, indent=2)

print(f"Successfully generated {len(profiles)} profiles in backend/data/profiles.json and root profiles.json!")
