interface TitleScreenProps {
  title: string;
  subtitle: string;
  onStart: () => void;
}

export const TitleScreen = ({ title, subtitle, onStart }: TitleScreenProps) => {
  return (
    <section className="title-screen">
      <div className="title-screen__backdrop" />
      <div className="title-screen__content">
        <p className="eyebrow">Steam Galgame MVP</p>
        <h1>{title}</h1>
        <p className="title-screen__subtitle">{subtitle}</p>
        <button className="primary-button" type="button" onClick={onStart}>
          开始游戏
        </button>
      </div>
    </section>
  );
};
