import { motion, MotionValue, useTransform } from 'framer-motion';

export const AnimatedIcon = ({
    icon: Icon,
    className,
    delay,
    scrollProgress,
}: {
    icon: React.ComponentType;
    className: string;
    delay: number;
    scrollProgress: MotionValue<number>;
}) => {
    // Transform scroll progress (0 to 1) into animation values
    const scale = useTransform(scrollProgress, [0, 0.8], [1, 0.5]); // Shrink to 50% size
    const opacity = useTransform(scrollProgress, [0, 0.6], [1, 0]); // Fade out during the first 60% of the scroll
    const filter = useTransform(scrollProgress, val => `blur(${val * 10}px)`); // Increase blur from 3px to 13px

    return (
        <motion.div
            className={`fixed text-7xl opacity-4 sm:opacity-100 ${className}`}
            style={{
                scale,
                opacity,
                filter,
            }}
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{
                type: 'spring',
                stiffness: 120,
                damping: 10,
                delay: delay, // Stagger the animations
            }}
        >
            <Icon />
        </motion.div>
    );
};
