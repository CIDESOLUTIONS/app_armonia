export async function sendMessage(data: {
  recipient: string;
  messageContent: string;
}): Promise<void> {
  return new Promise((resolve) => {
    setTimeout(() => {
      console.log(
        `Simulating message sent to ${data.recipient}: ${data.messageContent}`,
      );
      resolve();
    }, 1000);
  });
}
