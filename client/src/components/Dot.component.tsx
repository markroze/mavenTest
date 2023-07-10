interface DotProps {
  width?: number;
  x?: number;
  y?: number;
}

const Dot = ({ width = 20, x, y }: DotProps) => {
  return (
    <svg
      viewBox="0 0 20 20"
      xmlns="http://www.w3.org/2000/svg"
      {...{
        style: { width, position: 'absolute', left: x + 'px', top: y + 'px' },
      }}
    >
      <circle cx="10" cy="10" r="10" />
    </svg>
  );
};
export default Dot;
