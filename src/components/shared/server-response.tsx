import { TerminalSquare } from "lucide-react";

const ServerResponse = ({ response }: { response: string }) => {
  return (
    <div className="mt-4 rounded-md bg-black/90 p-4 border border-primary/30">
      <h4 className="mb-2 font-medium text-white flex items-center">
        <TerminalSquare size={16} className="mr-2 text-green-400" />
        Server Response:
      </h4>
      <p className="text-sm font-mono whitespace-pre-wrap text-green-400">
        {response}
      </p>
    </div>
  );
};

export default ServerResponse;
