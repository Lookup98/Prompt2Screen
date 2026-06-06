import { motion } from "framer-motion";

export default function AnimatedText({ text }) {
  // Split words to animate them smoothly
  const words = text.split(" ");

  const container = {
    hidden: { opacity: 0 },
    visible: (i = 1) => ({
      opacity: 1,
      transition: { staggerChildren: 0.03, delayChildren: 0.02 * i },
    }),
  };

  const child = {
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        type: "spring",
        damping: 25,
        stiffness: 200,
      },
    },
    hidden: {
      opacity: 0,
      y: 4,
    },
  };

  return (
    <motion.div
      variants={container}
      initial="hidden"
      animate="visible"
      className="flex flex-wrap gap-x-1 gap-y-0.5 leading-relaxed"
    >
      {words.map((word, index) => (
        <motion.span variants={child} key={index}>
          {word}
        </motion.span>
      ))}
    </motion.div>
  );
}