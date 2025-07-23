export function notifyAssemblyConvocation(
  assemblyId: number,
  title: string,
  scheduledDate: Date,
  location: string,
) {
  console.log(
    `Assembly Convocation: ${title} on ${scheduledDate} at ${location} (ID: ${assemblyId})`,
  );
}