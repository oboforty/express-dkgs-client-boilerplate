import { Argv } from 'yargs';

export function addArguments(yargs: Argv) {
    return yargs.command(
        'Jwks:update [url]',
        'Fetches JWK set from DKGS identity server',
        (yargs)=>{
            return yargs.positional('url', {
                describe: 'DoorsKGS identity server uri',
                default: 'http://localhost:5055'
            });
        },
        (argv)=>{
            console.log("teso", argv.url);
        }
    );
}
