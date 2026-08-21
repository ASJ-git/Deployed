const Button = ({ text = 'Visit Site', websiteLink = '#' }) => {
  return (
    <div className=" button text-white font-bold py-2 px-5 inline-block bg-blue-950 rounded ">
      <a
        href={websiteLink}
        target="_blank"
        rel="noopener noreferrer"
        onClick={(e) => e.stopPropagation()}
      >
         {text}
      </a>
    </div>
  );
};

export default Button;
