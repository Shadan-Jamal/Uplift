// import mongoose from 'mongoose';

// // Create a separate connection for the chat database
// const chatConnection = mongoose.createConnection(process.env.MONGO_CHAT_URI, {
//   useNewUrlParser: true,
//   useUnifiedTopology: true,
// });

// // Handle connection events
// chatConnection.on('connected', () => {
//   console.log('Connected to ChatDB');
// });

// chatConnection.on('error', (err) => {
//   console.error('ChatDB connection error:', err);
// });

// chatConnection.on('disconnected', () => {
//   console.log('Disconnected from ChatDB');
// });

// // Export the connection and a function to get models
// export const getChatDB = () => chatConnection;

// export const connectChatDB = async () => {
//   // If already connected, return the existing connection
//   if (chatConnection.readyState === 1) {
//     return chatConnection;
//   }
  
//   // Otherwise, wait for connection
//   return new Promise((resolve, reject) => {
//     chatConnection.once('connected', () => {
//       resolve(chatConnection);
//     });
    
//     chatConnection.once('error', (err) => {
//       reject(err);
//     });
//   });
// };
