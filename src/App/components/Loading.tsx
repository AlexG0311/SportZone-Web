interface Texto  {
    text?: string
}

export const Loading: React.FC<Texto> = ({text}) => {
    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50">
            <div className="text-center">
                <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mb-4"></div>
                {text}
            </div>
        </div>
    )
}