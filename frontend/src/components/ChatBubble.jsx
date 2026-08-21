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
            {/* Avatar padronizado para a cor sólida da marca */}
            <div className="w-10 shrink-0">
                {!isGrouped ? (
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-discord-blurple text-sm font-semibold text-white">
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
                        {/* Texto do apelido agora é sempre branco (removida a cor azul) */}
                        <span className="text-sm font-medium text-white">
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