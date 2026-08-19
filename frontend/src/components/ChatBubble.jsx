// Gera uma cor de avatar consistente com base no nome (hash simples)
function getAvatarColor(name = "") {
    const colors = [
        "bg-red-500",
        "bg-orange-500",
        "bg-amber-500",
        "bg-green-500",
        "bg-teal-500",
        "bg-blue-500",
        "bg-indigo-500",
        "bg-purple-500",
        "bg-pink-500",
    ];

    const hash = name
        .split("")
        .reduce((acc, char) => acc + char.charCodeAt(0), 0);

    return colors[hash % colors.length];
}

export default function ChatBubble({
                                       sender,
                                       time,
                                       text,
                                       isOwnMessage = false,
                                       isGrouped = false,
                                   }) {
    return (
        <div
            className={`group flex gap-3 px-4 py-0.5 hover:bg-white/[0.02] ${
                isGrouped ? "mt-0" : "mt-3"
            }`}
        >
            {/* Avatar (só aparece no início do grupo de mensagens) */}
            <div className="w-10 shrink-0">
                {!isGrouped ? (
                    <div
                        className={`flex h-10 w-10 items-center justify-center rounded-full text-sm font-semibold text-white ${getAvatarColor(
                            sender
                        )}`}
                    >
                        {sender?.charAt(0)?.toUpperCase() ?? "?"}
                    </div>
                ) : (
                    <span className="hidden pt-0.5 text-[10px] text-discord-text-muted group-hover:inline">
            {time}
          </span>
                )}
            </div>

            {/* Conteúdo da mensagem */}
            <div className="min-w-0 flex-1">
                {!isGrouped && (
                    <div className="flex items-baseline gap-2">
            <span
                className={`text-sm font-medium ${
                    isOwnMessage ? "text-discord-blurple" : "text-white"
                }`}
            >
              {sender}
            </span>
                        <span className="text-xs text-discord-text-muted">{time}</span>
                    </div>
                )}

                <p className="whitespace-pre-wrap break-words text-sm leading-relaxed text-discord-text-normal">
                    {text}
                </p>
            </div>
        </div>
    );
}