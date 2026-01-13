interface InfoCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  example: string;
}

export default function InfoCard({ icon, title, description, example }: InfoCardProps) {
  return (
    <div className="bg-white rounded-xl p-6 shadow-md border border-emerald-100">
      <div className="flex items-center gap-3 mb-3">
        <div className="text-emerald-600">{icon}</div>
        <h3 className="font-semibold text-gray-800">{title}</h3>
      </div>
      <p className="text-gray-600 text-sm mb-3">{description}</p>
      <div className="bg-emerald-50 rounded-lg p-3 border border-emerald-100">
        <p className="text-xs text-emerald-700">
          <span className="font-medium">Example:</span> {example}
        </p>
      </div>
    </div>
  );
}
