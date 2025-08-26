const fetchData = (messageData) => {
    console.log(req.body); // print all response

    // messageFrom=req.body['data']['from'] // sender number
    const messageMsg = req.body['data']['body']; // Message text
    console.log(messageMsg);

    res.status(200).end();

    // Return the messageMsg value
    return messageMsg;
};

// Export the fetchData function and messageMsg variable
export { fetchData, messageMsg };
