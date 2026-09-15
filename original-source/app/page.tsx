"use client";

import { useEffect, useMemo, useRef, useState } from "react";

type View = "intro" | "quiz" | "results";
type QuestionKey =
  | "source"
  | "state"
  | "space"
  | "household"
  | "experience"
  | "exercise"
  | "company"
  | "training"
  | "grooming"
  | "personality"
  | "noise"
  | "closeness";

type QuizAnswers = Partial<Record<QuestionKey, string>>;

type Option = {
  value: string;
  title: string;
  detail: string;
  icon: string;
};

type Question = {
  key: QuestionKey;
  eyebrow: string;
  title: string;
  help: string;
  options?: Option[];
};

type Breed = {
  name: string;
  saleSlug: string;
  adoptSlug: string;
  image: string;
  size: string;
  temperament: string[];
  summary: string;
  note: string;
  space: number;
  households: string[];
  experience: number;
  exercise: number;
  company: number;
  training: number;
  grooming: number;
  personalities: string[];
  noise: number;
  closeness: number;
};

const states = [
  ["Alabama", "alabama"], ["Alaska", "alaska"], ["Arizona", "arizona"],
  ["Arkansas", "arkansas"], ["California", "california"], ["Colorado", "colorado"],
  ["Connecticut", "connecticut"], ["Delaware", "delaware"], ["Florida", "florida"],
  ["Georgia", "georgia"], ["Hawaii", "hawaii"], ["Idaho", "idaho"],
  ["Illinois", "illinois"], ["Indiana", "indiana"], ["Iowa", "iowa"],
  ["Kansas", "kansas"], ["Kentucky", "kentucky"], ["Louisiana", "louisiana"],
  ["Maine", "maine"], ["Maryland", "maryland"], ["Massachusetts", "massachusetts"],
  ["Michigan", "michigan"], ["Minnesota", "minnesota"], ["Mississippi", "mississippi"],
  ["Missouri", "missouri"], ["Montana", "montana"], ["Nebraska", "nebraska"],
  ["Nevada", "nevada"], ["New Hampshire", "new-hampshire"], ["New Jersey", "new-jersey"],
  ["New Mexico", "new-mexico"], ["New York", "new-york"],
  ["North Carolina", "north-carolina"], ["North Dakota", "north-dakota"],
  ["Ohio", "ohio"], ["Oklahoma", "oklahoma"], ["Oregon", "oregon"],
  ["Pennsylvania", "pennsylvania"], ["Rhode Island", "rhode-island"],
  ["South Carolina", "south-carolina"], ["South Dakota", "south-dakota"],
  ["Tennessee", "tennessee"], ["Texas", "texas"], ["Utah", "utah"],
  ["Vermont", "vermont"], ["Virginia", "virginia"], ["Washington", "washington"],
  ["West Virginia", "west-virginia"], ["Wisconsin", "wisconsin"], ["Wyoming", "wyoming"],
] as const;

const questions: Question[] = [
  {
    key: "source",
    eyebrow: "First things first",
    title: "Are you dreaming of adoption or puppyhood?",
    help: "This decides which local Dog Academy guides we’ll show in your results.",
    options: [
      { value: "adopt", icon: "⌂", title: "I’d love to adopt", detail: "Show me dogs looking for homes" },
      { value: "buy", icon: "♡", title: "I’m looking for a puppy", detail: "Show me puppies from vetted sources" },
    ],
  },
  {
    key: "state",
    eyebrow: "Let’s get local",
    title: "Where should we look for your match?",
    help: "We’ll carry your state into every breed guide on your results page.",
  },
  {
    key: "space",
    eyebrow: "Home sweet home",
    title: "What does home look like?",
    help: "A yard is never a substitute for exercise, but room to move can affect which breeds feel comfortable.",
    options: [
      { value: "1", icon: "▥", title: "Apartment or small home", detail: "Little or no private outdoor space" },
      { value: "2", icon: "⌂", title: "Room to stretch", detail: "A typical home, patio, or small yard" },
      { value: "3", icon: "♧", title: "Plenty of space", detail: "A larger home and a secure yard" },
    ],
  },
  {
    key: "household",
    eyebrow: "Meet the family",
    title: "Who will welcome your new dog home?",
    help: "Early socialization and the individual dog always matter, but breed tendencies give us a useful starting point.",
    options: [
      { value: "adults", icon: "☺", title: "Just adults", detail: "A grown-up household" },
      { value: "kids", icon: "★", title: "Children under 12", detail: "A family with younger kids" },
      { value: "dogs", icon: "●", title: "Another dog", detail: "A canine roommate is waiting" },
      { value: "cats", icon: "◇", title: "Cats or small pets", detail: "A mixed-species home" },
      { value: "mixed", icon: "✦", title: "Kids and other pets", detail: "A lively, full household" },
    ],
  },
  {
    key: "experience",
    eyebrow: "Your dog-parent résumé",
    title: "How much dog experience do you have?",
    help: "There’s a wonderful match for every experience level—honesty just helps us find it.",
    options: [
      { value: "1", icon: "1", title: "This is my first dog", detail: "I’m ready to learn as we go" },
      { value: "2", icon: "2", title: "I know the basics", detail: "I’ve lived with or helped care for dogs" },
      { value: "3", icon: "3", title: "Very experienced", detail: "I’m comfortable with complex needs" },
    ],
  },
  {
    key: "exercise",
    eyebrow: "Walk this way",
    title: "How active will your days together be?",
    help: "Think about the routine you can sustain most days—not just your most ambitious Saturday.",
    options: [
      { value: "1", icon: "☁", title: "Short and easy", detail: "Up to about 45 minutes daily" },
      { value: "2", icon: "↗", title: "Steady and social", detail: "45–90 minutes of walks and play" },
      { value: "3", icon: "▲", title: "Adventure mode", detail: "90+ minutes, sports, hikes, or runs" },
    ],
  },
  {
    key: "company",
    eyebrow: "Quality time",
    title: "How much together-time can you offer?",
    help: "Include walks, play, training, and simply being home together on a typical weekday.",
    options: [
      { value: "1", icon: "◷", title: "Mornings and evenings", detail: "My dog may be alone for a workday" },
      { value: "2", icon: "◐", title: "Several hours", detail: "I’m around for chunks of the day" },
      { value: "3", icon: "☀", title: "Most of the day", detail: "Home-based life or a dog-friendly routine" },
    ],
  },
  {
    key: "training",
    eyebrow: "Learning together",
    title: "How do you feel about training?",
    help: "Every dog needs consistency. Some breeds especially love—or require—having a job for their brain.",
    options: [
      { value: "1", icon: "✓", title: "Keep it simple", detail: "Around 10 minutes and household basics" },
      { value: "2", icon: "+", title: "Happy to practice", detail: "20–30 minutes of daily skill-building" },
      { value: "3", icon: "✦", title: "Give me a challenge", detail: "Advanced skills, sports, or working tasks" },
    ],
  },
  {
    key: "grooming",
    eyebrow: "Coat check",
    title: "What’s your grooming tolerance?",
    help: "There’s no wrong answer—just be realistic about brushing, shedding, bathing, and professional appointments.",
    options: [
      { value: "1", icon: "—", title: "Low-fuss, please", detail: "An occasional brush and basic care" },
      { value: "2", icon: "≈", title: "A weekly routine is fine", detail: "Regular brushing doesn’t bother me" },
      { value: "3", icon: "✺", title: "I’m grooming-ready", detail: "Frequent brushing or salon visits are okay" },
    ],
  },
  {
    key: "personality",
    eyebrow: "The personality test",
    title: "Which dog personality wins you over?",
    help: "Pick the energy you would most love to come home to—we’ll use it for your breed matches and your dog-parent personality.",
    options: [
      { value: "snuggly", icon: "♥", title: "The snuggly shadow", detail: "Affectionate, devoted, and never far away" },
      { value: "social", icon: "☺", title: "The social butterfly", detail: "Friendly, outgoing, and ready to make pals" },
      { value: "clever", icon: "✦", title: "The clever teammate", detail: "Bright, focused, and eager to learn" },
      { value: "calm", icon: "☁", title: "The calm companion", detail: "Gentle, steady, and happy to take it easy" },
      { value: "bold", icon: "▲", title: "The bold adventurer", detail: "Curious, confident, and up for anything" },
    ],
  },
  {
    key: "noise",
    eyebrow: "Volume check",
    title: "How much dog commentary can your home handle?",
    help: "Every dog can bark, but some breeds are naturally more vocal than others. Think about neighbors, sleeping children, and your own noise tolerance.",
    options: [
      { value: "1", icon: "—", title: "Quiet is important", detail: "Less barking is a genuine priority" },
      { value: "2", icon: "♪", title: "A little chatter is fine", detail: "Some alert barking won’t bother me" },
      { value: "3", icon: "!", title: "Let them have opinions", detail: "A naturally vocal dog is welcome" },
    ],
  },
  {
    key: "closeness",
    eyebrow: "Last one",
    title: "What kind of bond are you hoping for?",
    help: "Some dogs want to supervise every bathroom trip; others love you deeply from the other end of the sofa.",
    options: [
      { value: "1", icon: "◇", title: "Independent besties", detail: "We can both enjoy a little personal space" },
      { value: "2", icon: "↔", title: "The best of both", detail: "Affectionate without needing constant contact" },
      { value: "3", icon: "∞", title: "Velcro dog, please", detail: "I want a devoted shadow and champion cuddler" },
    ],
  },
];

const breeds: Breed[] = [
  {
    name: "Golden Retriever",
    saleSlug: "golden-retriever-for-sale",
    adoptSlug: "adopt-a-golden-retriever",
    image: "https://dogacademy.org/puppies-for-sale/wp-content/uploads/elementor/thumbs/Golden-Retriever-main-3-r632l6ajc8xcmljamkil2urqh21gza2z43f63dkz0g.jpg",
    size: "Large", temperament: ["Friendly", "Playful", "People-focused"],
    summary: "An affectionate, eager companion for people who want an active dog at the center of family life.",
    note: "Plan for daily activity, plenty of together-time, and regular coat care.",
    space: 2, households: ["adults", "kids", "dogs", "cats", "mixed"], experience: 1, exercise: 3, company: 3, training: 2, grooming: 2,
    personalities: ["snuggly", "social"], noise: 2, closeness: 3,
  },
  {
    name: "Labrador Retriever",
    saleSlug: "labrador-retriever-for-sale",
    adoptSlug: "adopt-a-labrador-retriever",
    image: "https://dogacademy.org/puppies-for-sale/wp-content/uploads/elementor/thumbs/Labrador-Retriever-Main-1-r8e3uqdqczrvveu714emsy4vogie70g59r5brdvy2o.jpg",
    size: "Large", temperament: ["Outgoing", "Gentle", "Trainable"],
    summary: "A social, enthusiastic all-rounder that often thrives with active families and first-time owners.",
    note: "Labs need meaningful exercise, mental stimulation, and patience through their mouthy puppy stage.",
    space: 2, households: ["adults", "kids", "dogs", "cats", "mixed"], experience: 1, exercise: 3, company: 3, training: 2, grooming: 2,
    personalities: ["social", "bold"], noise: 2, closeness: 3,
  },
  {
    name: "Dachshund",
    saleSlug: "dachshund-for-sale",
    adoptSlug: "adopt-a-dachshund",
    image: "https://dogacademy.org/puppies-for-sale/wp-content/uploads/elementor/thumbs/Dachsund-Main-2-r62pu6po3mltde8pso3w16frwmc3c0xicbams84ncw.jpg",
    size: "Small", temperament: ["Clever", "Affectionate", "Bold"],
    summary: "A compact companion with a huge personality, a curious streak, and strong loyalty to their people.",
    note: "Gentle, consistent training and back-safe home arrangements are especially important.",
    space: 1, households: ["adults", "kids", "dogs", "cats", "mixed"], experience: 2, exercise: 2, company: 2, training: 2, grooming: 1,
    personalities: ["snuggly", "bold"], noise: 3, closeness: 3,
  },
  {
    name: "Shih Tzu",
    saleSlug: "shih-tzu-for-sale",
    adoptSlug: "adopt-a-shih-tzu",
    image: "https://dogacademy.org/adoption/wp-content/uploads/2025/12/shih-tzu-puppy-with-yellow-flower-decor-on-blue-background-600x398.jpg",
    size: "Small", temperament: ["Affectionate", "Adaptable", "Sociable"],
    summary: "A cheerful, home-loving companion that fits compact spaces and usually treasures human company.",
    note: "Their beautiful coat and face need committed, regular grooming and care.",
    space: 1, households: ["adults", "kids", "dogs", "cats", "mixed"], experience: 1, exercise: 1, company: 3, training: 2, grooming: 3,
    personalities: ["snuggly", "calm"], noise: 2, closeness: 3,
  },
  {
    name: "Greyhound",
    saleSlug: "greyhound-for-sale",
    adoptSlug: "adopt-a-greyhound",
    image: "https://dogacademy.org/puppies-for-sale/wp-content/uploads/elementor/thumbs/Greyhound-Main-1-r890h79lk4ry6hxic2oblbkqgkm7e5ttb7jj4c1jy8.jpg",
    size: "Large", temperament: ["Gentle", "Calm", "Sensitive"],
    summary: "A surprisingly relaxed, low-fuss companion that enjoys daily walks and a safe place for the occasional sprint.",
    note: "Ask about prey drive and cat compatibility for each individual greyhound.",
    space: 1, households: ["adults", "kids", "dogs", "mixed"], experience: 1, exercise: 2, company: 2, training: 1, grooming: 1,
    personalities: ["calm", "snuggly"], noise: 1, closeness: 2,
  },
  {
    name: "Australian Shepherd",
    saleSlug: "australian-shepherd-for-sale",
    adoptSlug: "adopt-an-australian-shepherd",
    image: "https://dogacademy.org/puppies-for-sale/wp-content/uploads/2026/06/australian-shepherd-puppy-with-a-toy-1024x683.jpg",
    size: "Medium", temperament: ["Brilliant", "Athletic", "Devoted"],
    summary: "A high-drive teammate for experienced, active people who genuinely enjoy training and dog sports.",
    note: "Aussies need substantial physical exercise, brain work, and thoughtful management of herding instincts.",
    space: 3, households: ["adults", "kids", "dogs", "mixed"], experience: 2, exercise: 3, company: 3, training: 3, grooming: 2,
    personalities: ["clever", "bold"], noise: 2, closeness: 3,
  },
  {
    name: "French Bulldog",
    saleSlug: "french-bulldog-for-sale",
    adoptSlug: "adopt-a-french-bulldog",
    image: "https://dogacademy.org/puppies-for-sale/wp-content/uploads/elementor/thumbs/French-Bulldog-Main-1-r896iesyuw4b2kf6zgppa0cc900p474u6anuh7zg3k.jpg",
    size: "Small", temperament: ["Playful", "Affectionate", "Sociable"],
    summary: "A funny, compact companion for people who value cuddles and play more than long-distance adventures.",
    note: "Choose a health-conscious source and plan carefully around heat, breathing, and swimming safety.",
    space: 1, households: ["adults", "kids", "dogs", "cats", "mixed"], experience: 1, exercise: 1, company: 3, training: 2, grooming: 1,
    personalities: ["snuggly", "social"], noise: 1, closeness: 3,
  },
  {
    name: "Cavapoo",
    saleSlug: "cavapoo-for-sale",
    adoptSlug: "adopt-a-cavapoo",
    image: "https://dogacademy.org/puppies-for-sale/wp-content/uploads/2026/06/260810139_m-300x200.jpg",
    size: "Small", temperament: ["Gentle", "Eager", "Affectionate"],
    summary: "A people-oriented, adaptable small dog that often suits first-time owners and sociable homes.",
    note: "Cavapoos need regular coat care and can struggle when left alone for long stretches.",
    space: 1, households: ["adults", "kids", "dogs", "cats", "mixed"], experience: 1, exercise: 2, company: 3, training: 2, grooming: 3,
    personalities: ["snuggly", "social"], noise: 2, closeness: 3,
  },
  {
    name: "Rottweiler",
    saleSlug: "rottweiler-for-sale",
    adoptSlug: "adopt-a-rottweiler",
    image: "https://dogacademy.org/puppies-for-sale/wp-content/uploads/elementor/thumbs/Rottweiler-Main-1-r89byt6yuoz4xf525cxf9g5klbznfgtsidu6cks400.jpg",
    size: "Large", temperament: ["Loyal", "Confident", "Protective"],
    summary: "A powerful, devoted companion for an experienced owner ready to prioritize training and socialization.",
    note: "Check housing and insurance rules, and commit to early, ongoing reward-based training.",
    space: 3, households: ["adults", "kids", "dogs", "mixed"], experience: 3, exercise: 3, company: 2, training: 3, grooming: 1,
    personalities: ["bold", "clever"], noise: 2, closeness: 3,
  },
];

const previewDogs = breeds.slice(0, 3);
const numberAnswer = (answers: QuizAnswers, key: QuestionKey, fallback = 2) => Number(answers[key] ?? fallback);

function rankBreeds(answers: QuizAnswers) {
  const household = answers.household ?? "adults";
  return breeds
    .map((breed) => {
      let score = 0;
      const space = numberAnswer(answers, "space");
      const experience = numberAnswer(answers, "experience");
      const exercise = numberAnswer(answers, "exercise");
      const company = numberAnswer(answers, "company");
      const training = numberAnswer(answers, "training");
      const grooming = numberAnswer(answers, "grooming");
      const noise = numberAnswer(answers, "noise");
      const closeness = numberAnswer(answers, "closeness");

      score += space >= breed.space ? 8 : -12 * (breed.space - space);
      score += breed.households.includes(household) ? 8 : household === "adults" ? 3 : -8;
      score += experience >= breed.experience ? 7 : -11 * (breed.experience - experience);
      score += 9 - Math.abs(exercise - breed.exercise) * 6;
      score += company >= breed.company ? 7 : -10 * (breed.company - company);
      score += training >= breed.training ? 7 : -10 * (breed.training - training);
      score += grooming >= breed.grooming ? 6 : -9 * (breed.grooming - grooming);
      score += breed.personalities.includes(answers.personality ?? "calm") ? 9 : -2;
      score += 8 - Math.abs(noise - breed.noise) * 6;
      score += 8 - Math.abs(closeness - breed.closeness) * 5;
      return { breed, score };
    })
    .sort((a, b) => b.score - a.score)
    .slice(0, 3);
}

const spaceText: Record<string, string> = {
  "1": "compact-home routine",
  "2": "home and outdoor setup",
  "3": "roomy home and active lifestyle",
};

const householdText: Record<string, string> = {
  adults: "adult household",
  kids: "family with younger children",
  dogs: "home with another dog",
  cats: "home with cats or small pets",
  mixed: "busy family home",
};

const exerciseText: Record<string, string> = {
  "1": "easygoing exercise plan",
  "2": "steady walks-and-play routine",
  "3": "adventure-ready activity level",
};

const noiseText: Record<string, string> = {
  "1": "a quieter home",
  "2": "a little conversational charm",
  "3": "a dog with plenty to say",
};

const closenessText: Record<string, string> = {
  "1": "an independent friendship",
  "2": "a balanced, affectionate bond",
  "3": "a devoted little shadow",
};

type Persona = {
  title: string;
  icon: string;
  copy: string;
  traits: string[];
};

function personaFor(answers: QuizAnswers): Persona {
  if (answers.training === "3" || answers.personality === "clever") {
    return {
      title: "The Clever Co-Conspirator",
      icon: "✦",
      copy: "You don’t just want a pet—you want a bright, curious teammate who will learn your routines, master new skills, and keep life interesting.",
      traits: ["Brain games", "Shared projects", "Big potential"],
    };
  }
  if (answers.exercise === "3" || answers.personality === "bold") {
    return {
      title: "The Adventure Duo",
      icon: "▲",
      copy: "Your happiest match has four paws, excellent stamina, and absolutely no objection to turning an ordinary weekend into an expedition.",
      traits: ["Active days", "Bold spirit", "Always exploring"],
    };
  }
  if (answers.closeness === "3" || answers.personality === "snuggly") {
    return {
      title: "The Cozy Co-Pilot",
      icon: "♥",
      copy: "You’re looking for an affectionate sidekick who considers errands a joint activity and the sofa a place for extremely close teamwork.",
      traits: ["Champion cuddles", "Loyal company", "Everyday sidekick"],
    };
  }
  if (answers.personality === "social" || ["kids", "mixed"].includes(answers.household ?? "")) {
    return {
      title: "The Social Butterfly Pack",
      icon: "☺",
      copy: "You want a friendly, adaptable dog who can make themselves at home in a lively life—and possibly collect admirers everywhere you go.",
      traits: ["Friendly energy", "Family life", "New best friends"],
    };
  }
  return {
    title: "The Easygoing Dream Team",
    icon: "☁",
    copy: "You’re after the good-life version of dog ownership: gentle companionship, sustainable routines, and plenty of calm moments together.",
    traits: ["Steady rhythm", "Gentle company", "Low-key joy"],
  };
}

function reasonsFor(breed: Breed, answers: QuizAnswers) {
  const reasons = [
    `Fits your ${spaceText[answers.space ?? "2"]}.`,
    breed.households.includes(answers.household ?? "adults")
      ? `Tends to suit a ${householdText[answers.household ?? "adults"]} with thoughtful introductions.`
      : "Can be rewarding with careful introductions and individual assessment.",
    `Lines up with your ${exerciseText[answers.exercise ?? "2"]}.`,
    breed.personalities.includes(answers.personality ?? "calm")
      ? "Its typical personality has the spark you said you love."
      : "Its temperament could bring a complementary energy to your home.",
  ];

  if (numberAnswer(answers, "experience") >= breed.experience) {
    reasons.push("Its typical handling needs fit your experience level.");
  }
  if (numberAnswer(answers, "grooming") >= breed.grooming) {
    reasons.push("The coat-care routine matches what you’re willing to take on.");
  }
  if (numberAnswer(answers, "noise") >= breed.noise) {
    reasons.push("Its usual vocal style fits your household’s noise tolerance.");
  }
  return reasons.slice(0, 4);
}

const answerParams: Record<QuestionKey, string> = {
  source: "src",
  state: "st",
  space: "sp",
  household: "hh",
  experience: "ex",
  exercise: "ac",
  company: "co",
  training: "tr",
  grooming: "gr",
  personality: "pe",
  noise: "no",
  closeness: "cl",
};

export function BreedQuiz({ embedded = false }: { embedded?: boolean }) {
  const [view, setView] = useState<View>("intro");
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState<QuizAnswers>({});
  const [copyStatus, setCopyStatus] = useState("");
  const shellRef = useRef<HTMLElement>(null);
  const matches = useMemo(() => rankBreeds(answers), [answers]);
  const persona = useMemo(() => personaFor(answers), [answers]);
  const question = questions[step];
  const selectedState = states.find((state) => state[1] === answers.state);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const restored: QuizAnswers = {};
    questions.forEach(({ key }) => {
      const value = params.get(answerParams[key]);
      if (value) restored[key] = value;
    });
    if (questions.every(({ key }) => restored[key])) {
      const frame = window.requestAnimationFrame(() => {
        setAnswers(restored);
        setView("results");
      });
      return () => window.cancelAnimationFrame(frame);
    }
  }, []);

  useEffect(() => {
    if (!embedded || !shellRef.current) return;
    const sendHeight = () => {
      window.parent.postMessage(
        { type: "dog-academy-quiz:resize", height: Math.ceil(document.documentElement.scrollHeight) },
        "*",
      );
    };
    const observer = new ResizeObserver(sendHeight);
    observer.observe(shellRef.current);
    sendHeight();
    return () => observer.disconnect();
  }, [embedded, view, step]);

  const moveToTop = () => window.scrollTo({ top: 0, behavior: "smooth" });

  const startQuiz = () => {
    setView("quiz");
    setStep(0);
    moveToTop();
  };

  const answerQuestion = (value: string) => {
    const nextAnswers = { ...answers, [question.key]: value };
    setAnswers(nextAnswers);
    if (step === questions.length - 1) {
      setView("results");
      moveToTop();
      return;
    }
    setStep((current) => current + 1);
    moveToTop();
  };

  const goBack = () => {
    if (step === 0) {
      setView("intro");
      return;
    }
    setStep((current) => current - 1);
  };

  const retake = () => {
    setAnswers({});
    setStep(0);
    setView("quiz");
    window.history.replaceState({}, "", window.location.pathname);
    moveToTop();
  };

  const resultUrl = () => {
    const url = new URL("/", window.location.origin);
    questions.forEach(({ key }) => {
      const value = answers[key];
      if (value) url.searchParams.set(answerParams[key], value);
    });
    return url.toString();
  };

  const shareText = () => {
    const bestMatch = matches[0]?.breed.name ?? "a new best friend";
    return `I’m ${persona.title} — and my top Dog Academy breed match is ${bestMatch}! Take the dog breed quiz to find yours.`;
  };

  const copyResult = async () => {
    try {
      await navigator.clipboard.writeText(resultUrl());
      setCopyStatus("Link copied!");
    } catch {
      setCopyStatus("Copy this link from your address bar.");
    }
  };

  const nativeShare = async () => {
    if (!navigator.share) {
      await copyResult();
      return;
    }
    try {
      await navigator.share({ title: "My Dog Academy breed match", text: shareText(), url: resultUrl() });
    } catch {
      // Closing the native share sheet is not an error the visitor needs to see.
    }
  };

  const openShare = (url: string) => {
    window.open(url, "_blank", "noopener,noreferrer,width=720,height=640");
  };

  const matchUrl = (breed: Breed) => {
    const stateSlug = answers.state ?? "california";
    return answers.source === "adopt"
      ? `https://dogacademy.org/adoption/${breed.adoptSlug}/${stateSlug}/`
      : `https://dogacademy.org/puppies-for-sale/${breed.saleSlug}/${stateSlug}/`;
  };

  return (
    <main ref={shellRef} className={`site-shell${embedded ? " is-embedded" : ""}`}>
      <header className="site-header">
        <a className="brand" href="https://dogacademy.org/" aria-label="Dog Academy home">
          <span className="brand-mark" aria-hidden="true">
            <span className="brand-ear brand-ear-left" />
            <span className="brand-ear brand-ear-right" />
            <span className="brand-face">D</span>
          </span>
          <span className="brand-name">DOG ACADEMY</span>
        </a>
        <span className="header-note">Dog breed quiz</span>
      </header>

      {view === "intro" && (
        <section className="hero" aria-labelledby="hero-title">
          <div className="hero-copy">
            <p className="eyebrow"><span aria-hidden="true">✦</span> Find your perfect match</p>
            <h1 id="hero-title">Dog Breed Quiz: Which Dog Is Right for You?</h1>
            <p className="hero-intro">
              Wondering what dog breed is right for you? Tell us about your home,
              routine, and personality to find the best dog breeds for your real life.
            </p>
            <button className="primary-button" type="button" onClick={startQuiz}>
              Find my perfect breed <span aria-hidden="true">→</span>
            </button>
            <div className="hero-facts" aria-label="Quiz details">
              <span><strong>12</strong> quick questions</span>
              <span><strong>3</strong> tailored matches</span>
              <span><strong>50</strong> states covered</span>
            </div>
          </div>

          <div className="hero-visual" aria-label="A few possible breed matches">
            <div className="scribble scribble-one" aria-hidden="true" />
            <div className="scribble scribble-two" aria-hidden="true" />
            {previewDogs.map((dog, index) => (
              <figure className={`dog-card dog-card-${index + 1}`} key={dog.name}>
                <img src={dog.image} alt={`${dog.name} puppy`} />
                <figcaption>{dog.name}</figcaption>
              </figure>
            ))}
            <span className="match-badge">Your match<br />is waiting</span>
          </div>
        </section>
      )}

      {view === "quiz" && (
        <section className="quiz-stage" aria-labelledby="quiz-question">
          <div className="quiz-topline">
            <button className="text-button" type="button" onClick={goBack}>← Back</button>
            <span>Question {step + 1} of {questions.length}</span>
          </div>
          <div className="progress-track" aria-label={`Quiz progress: question ${step + 1} of ${questions.length}`}>
            <span style={{ width: `${((step + 1) / questions.length) * 100}%` }} />
          </div>
          <div className="question-panel" key={question.key}>
            <p className="eyebrow">{question.eyebrow}</p>
            <h2 id="quiz-question">{question.title}</h2>
            <p>{question.help}</p>

            {question.key === "state" ? (
              <div className="state-answer">
                <label htmlFor="state-select">Your state</label>
                <div className="select-wrap">
                  <select
                    id="state-select"
                    value={answers.state ?? ""}
                    onChange={(event) => setAnswers((current) => ({ ...current, state: event.target.value }))}
                  >
                    <option value="" disabled>Select a state</option>
                    {states.map(([name, slug]) => <option value={slug} key={slug}>{name}</option>)}
                  </select>
                </div>
                <button
                  type="button"
                  className="primary-button state-continue"
                  disabled={!answers.state}
                  onClick={() => answerQuestion(answers.state ?? "")}
                >
                  Keep going <span aria-hidden="true">→</span>
                </button>
              </div>
            ) : (
              <div className={`answer-grid ${question.options?.length === 2 ? "answer-grid-two" : "answer-grid-three"}`}>
                {question.options?.map((option) => (
                  <button
                    className="answer-card"
                    type="button"
                    key={option.value}
                    aria-pressed={answers[question.key] === option.value}
                    onClick={() => answerQuestion(option.value)}
                  >
                    <span className="answer-icon" aria-hidden="true">{option.icon}</span>
                    <strong>{option.title}</strong>
                    <small>{option.detail}</small>
                  </button>
                ))}
              </div>
            )}
          </div>
        </section>
      )}

      {view === "results" && (
        <section className="results-stage" aria-labelledby="results-title">
          <div className="results-heading">
            <p className="eyebrow">Your Dog Academy matches</p>
            <h1 id="results-title">We found your pack.</h1>
            <p>
              Based on your lifestyle and your {answers.source === "adopt" ? "adoption" : "puppy"} search in {selectedState?.[0]},
              these three breeds rise to the top.
            </p>
          </div>

          <article className="personality-result" aria-labelledby="persona-title">
            <div className="persona-icon" aria-hidden="true">{persona.icon}</div>
            <div className="persona-copy">
              <p className="persona-eyebrow">Your dog-parent match style</p>
              <h2 id="persona-title">You’re {persona.title}.</h2>
              <p>
                {persona.copy} You’re happiest with {closenessText[answers.closeness ?? "2"]}
                {" "}and {noiseText[answers.noise ?? "2"]}.
              </p>
              <div className="persona-traits" aria-label="Your match-style traits">
                {persona.traits.map((trait) => <span key={trait}>{trait}</span>)}
              </div>
            </div>
          </article>

          <div className="results-grid">
            {matches.map(({ breed }, index) => (
              <article className={`result-card result-card-${index + 1}`} key={breed.name}>
                <div className="result-photo">
                  <img
                    src={breed.image}
                    alt={breed.name}
                    onError={(event) => { event.currentTarget.style.opacity = "0"; }}
                  />
                  <span className="rank-badge">{index === 0 ? "Best match" : index === 1 ? "Great match" : "Worth a look"}</span>
                </div>
                <div className="result-content">
                  <div className="breed-heading">
                    <h2>{breed.name}</h2>
                    <span>{breed.size}</span>
                  </div>
                  <div className="trait-row" aria-label={`${breed.name} temperament`}>
                    {breed.temperament.map((trait) => <span key={trait}>{trait}</span>)}
                  </div>
                  <p className="breed-summary">{breed.summary}</p>
                  <h3>Why you match</h3>
                  <ul>
                    {reasonsFor(breed, answers).map((reason) => <li key={reason}>{reason}</li>)}
                  </ul>
                  <div className="breed-note"><strong>Good to know:</strong> {breed.note}</div>
                  <a className="result-link" href={matchUrl(breed)} target="_blank" rel="noreferrer">
                    {answers.source === "adopt" ? "See" : "Find"} {breed.name} {answers.source === "adopt" ? "dogs" : "puppies"} in {selectedState?.[0]} <span aria-hidden="true">↗</span>
                  </a>
                </div>
              </article>
            ))}
          </div>

          <section className="share-panel" aria-labelledby="share-title">
            <div>
              <p className="share-eyebrow">Pass it around</p>
              <h2 id="share-title">Share your match</h2>
              <p>{shareText()}</p>
            </div>
            <div className="share-actions">
              <button className="share-primary" type="button" onClick={nativeShare}>Share my result</button>
              <button
                type="button"
                onClick={() => openShare(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(resultUrl())}`)}
                aria-label="Share this result on Facebook"
              >Facebook</button>
              <button
                type="button"
                onClick={() => openShare(`https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText())}&url=${encodeURIComponent(resultUrl())}`)}
                aria-label="Share this result on X"
              >X</button>
              <button
                type="button"
                onClick={() => openShare(`https://pinterest.com/pin/create/button/?url=${encodeURIComponent(resultUrl())}&media=${encodeURIComponent(matches[0]?.breed.image ?? "")}&description=${encodeURIComponent(shareText())}`)}
                aria-label="Share this result on Pinterest"
              >Pinterest</button>
              <a
                href={`mailto:?subject=${encodeURIComponent("My Dog Academy breed match")}&body=${encodeURIComponent(`${shareText()} ${resultUrl()}`)}`}
              >Email</a>
              <button type="button" onClick={copyResult}>Copy link</button>
              <span className="copy-status" aria-live="polite">{copyStatus}</span>
            </div>
          </section>

          <div className="results-footer">
            <div>
              <h2>A breed is a beginning, not the whole story.</h2>
              <p>Individual temperament, health, age, socialization, and training matter. Meet any dog in person and ask detailed questions before deciding.</p>
            </div>
            <div className="results-actions">
              <button className="secondary-button" type="button" onClick={() => { setView("quiz"); setStep(questions.length - 1); moveToTop(); }}>Adjust my answers</button>
              <button className="primary-button" type="button" onClick={retake}>Retake the quiz <span aria-hidden="true">↻</span></button>
            </div>
          </div>
        </section>
      )}

      <footer className="site-footer">
        <span>Built for happy beginnings.</span>
        <span>Breed guidance, not a guarantee of individual temperament.</span>
      </footer>
    </main>
  );
}

export default function Home() {
  return <BreedQuiz />;
}
