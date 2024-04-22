export const getParams = () => {
    const params: Record<string, string> = {
        theme: 'default',
        version: '0.1.0',
        branch: 'master',
        all: 'false',
    };

    process.argv.slice(2).forEach((argument: string) => {
        const [key, value] = argument.split('=');
        params[key] = value;
    });

    return params;
};
