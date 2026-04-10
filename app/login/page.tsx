const iconSpace = null;

const oauthProviders = [
    {
        name: 'Discord',
        icon: {iconSpace},
        bg: '#5865F2',
        text: '#FFFFFF',
        href: '/api/auth/discord',
    },

     {
        name: 'Telegram',
        icon: {iconSpace},
        bg: '#229ED9',
        text: '#FFFFFF',
        href: '/api/auth/telegram',
    },

     {
        name: 'X',
        icon: {iconSpace},
        bg: '#0F0F0F',
        text: '#FFFFFF',
        href: '/api/auth/X',
    },
]

export default function LoginPage() {
    return (
        <>
        <div>
            <div className="icon">
                {iconSpace} <span>Polly</span>
            </div>

            <h1>
                Verify <br />
                who you are.
            </h1>

            <p>
                Connect your account. We'll use it to confirm <br />
                your identity to prevent fake accounts from <br />
                entering.
            </p>
        </div>

        <div>
            <div className="flex flex-col gap-3 p-6">
                {oauthProviders.map((provider) => (
                <a 
                key={provider.name}
                href={provider.href}
                className="flex items-center gap-3 px-5 py-4 rounded-2xl font-bold text-sm w-full transition-opacity hover:opacity-80"
                style={{ backgroundColor: provider.bg, color: provider.text}}
                ></a> 
                ))}
            </div>
        </div>

        <div className="flex p-6 rounded-2xl opacity-40 w-full bg-ghost">
            <p className="text-mid">
                Each platform ties one account to a real user.
            </p>
        </div>
        </>
    );
}