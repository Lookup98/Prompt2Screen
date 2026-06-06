import { motion } from "framer-motion";

export default function TypingIndicator() {
  const dotVariants = {
    animate: (i) => ({
      y: [0, -6, 0],
      transition: {
        duration: 0.6,
        repeat: Infinity,
        delay: i * 0.15,
      },
    }),
  };

  return (
    <div className="flex space-x-1.5 p-3 bg-zinc-800 rounded-2xl w-fit items-center">
      {[0, 1, 2].map((i) => (
        <motion.div
          key={i}
          custom={i}
          variants={dotVariants}
          animate="animate"
          className="w-2 h-2 bg-zinc-400 rounded-full"
        />
      ))}
    </div>
  );
}