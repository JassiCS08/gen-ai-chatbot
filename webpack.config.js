module.exports = {
    // ... other webpack configurations
  
    resolve: {
      fallback: {
        "url": require.resolve("url/"),
      },
    },
  };
  