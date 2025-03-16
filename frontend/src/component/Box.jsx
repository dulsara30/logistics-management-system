import Box from "@mui/material/Box";

const BoxComponent = ({ imageUrl, width = "100%", height = "300px" }) => {
  return (
    <Box
      sx={{
        backgroundImage: `url(${imageUrl})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
        width: width,
        height: height,
      }}
    />
  );
};

export default BoxComponent;
