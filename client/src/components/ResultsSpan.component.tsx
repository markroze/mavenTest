const ResultsSpan = ({ color, label }: { color: string; label: string }) => {
  return (
    <div {...{ style: { color, position: 'fixed', bottom: 0, width: '100%' } }}>
      {label}
    </div>
  );
};
export default ResultsSpan;
