import { config, useTransition, animated } from '@react-spring/web';

const FlagTransition = ({ flag, styles, ...props }) => {
  const transitions = useTransition(flag, {
    from: { x: "100%" },
    enter: { x: "0" },
    leave: { x: "-100%" },
    config: config.slow,
  });

  return (
    <div className={`${props.className} relative h-full w-full overflow-hidden`} style={styles}>
      {transitions((style, item) =>
        <animated.img
          className="w-full h-full object-contain"
          style={{ ...style, position: "absolute" }}
          src={item.flags.svg}
          alt={item.name.common}
        />
      )}
    </div>
  );
};

export default FlagTransition;
