import React, { ReactNode, useState } from 'react';
import MailchimpSubscribe from 'react-mailchimp-subscribe';
import { useNavigate } from 'react-router-dom';

import clsx from 'clsx';

import Button from '../components/button';
import { Tag } from '../components/tag';

function Section({
  title,
  image,
  children,
  className,
}: {
  title: ReactNode;
  image?: ReactNode;
  children: ReactNode;
  className?: string;
}) {
  return (
    <div
      className={clsx(
        'flex justify-center w-full px-10 py-20 even:bg-gray-50 group sm:even:text-right',
        className,
      )}
    >
      <div className="flex flex-col items-center w-full max-w-3xl sm:group-odd:flex-row-reverse sm:flex-row">
        {image && (
          <>
            {typeof image === 'string' ? (
              <img src={process.env.PUBLIC_URL + image} alt="graphic" className="w-40 h-40" />
            ) : (
              image
            )}
            <div className="flex-1 min-w-[40px]"></div>
          </>
        )}
        <div className={image ? 'max-w-md mt-8 sm:mt-0' : ''}>
          <div className="mb-4 text-5xl font-medium">{title}</div>
          <div className="text-lg">{children}</div>
        </div>
      </div>
    </div>
  );
}

function MenuItem({ children, url }: { children: ReactNode; url: string }) {
  const navigate = useNavigate();

  return (
    <div
      className="items-center hidden mx-4 cursor-pointer sm:flex hover-bold"
      onClick={() => navigate(url)}
    >
      {children}
    </div>
  );
}

function Home({ onLaunch }: { onLaunch: () => void }) {
  const navigate = useNavigate();

  const [email, setEmail] = useState<string>('');

  return (
    <div className="flex flex-col items-center">
      <div className="flex items-center w-full px-4 py-2 bg-white">
        <div onClick={() => navigate('/')} className="flex items-center cursor-pointer">
          <img src={process.env.PUBLIC_URL + '/logo.png'} alt="logo" className="h-12 mr-1" />
          <div className="flex items-center text-xl text-white pixel border-text">Agnosis</div>
        </div>

        <div className="flex-1"></div>

        <MenuItem url="">
          Marketplace <Tag className="ml-2">Coming soon</Tag>
        </MenuItem>

        <div className="flex-1"></div>

        <Button onClick={onLaunch} className="hidden sm:flex">
          Launch app
        </Button>
      </div>

      <div className="w-full">
        <Section title={<span className="pixel">Agnosis</span>} image="/owl.png">
          <div>
            The first zero knowledge puzzle gaming company. Play competitive games without showing
            your hand.
          </div>
          <div className="hidden mt-8 sm:flex">
            <Button onClick={onLaunch}>Get started</Button>
          </div>
        </Section>

        <Section
          title="Puzzles"
          image={
            <video
              src={process.env.PUBLIC_URL + '/gameplay.mov'}
              controls={true}
              autoPlay={true}
              className="shadow-md w-80"
            />
          }
        >
          Play interesting levels to learn how to game works.
        </Section>

        <Section title="Competitions" image="/viking_helmet.png">
          Challenge yourself by joining in daily competitions and competing against players from all
          around the world.
        </Section>

        <Section title="NFTs" image="/nfts.png">
          Get unique OWL NFTs by winning competitions and completing challenges.
        </Section>

        <Section title="Community" image="/community.png">
          Design levels and upload them to share with others. Vote on community levels to feature in
          competitions.
        </Section>

        <Section title="Trade" image="/market.png">
          Buy and sell OWLs, wearables and levels.
        </Section>

        <Section title="Token" image="/coin.png">
          Earn $AGN by playing the game, creating cool levels and trading. Use your $AGN to
          participate in competitions and vote on community levels.
        </Section>

        <div className="flex justify-center w-full px-10 py-20 bg-gray-200">
          <div className="flex flex-col items-center w-full max-w-3xl">
            <div className="mb-12 text-5xl sm:mb-8">Powered by</div>
            <div className="flex flex-wrap items-center justify-center">
              <img
                src={process.env.PUBLIC_URL + '/polygon-logo.svg'}
                alt="polygon"
                className="h-10 mb-4 mr-10 alias"
              />
              <img
                src={process.env.PUBLIC_URL + '/circom-logo.png'}
                alt="circom"
                className="h-16 mb-4 mr-10 alias"
              />
              <img
                src={process.env.PUBLIC_URL + '/zkrepl-logo.png'}
                alt="zkrepl"
                className="h-16 mb-4 alias"
              />
            </div>
          </div>
        </div>

        <Section title="Stay tuned" image="/mail.png">
          <MailchimpSubscribe
            url={
              'https://gmail.us10.list-manage.com/subscribe/post?u=5fd73ac399b894f62fadbf9b6&id=dccd1ca950'
            }
            render={({ subscribe, status, message }) => (
              <div>
                <div className="my-8">
                  <input
                    type="email"
                    value={email}
                    className="px-4 py-2 border-2 border-black rounded-lg pixel"
                    onChange={e => setEmail(e.target.value)}
                    placeholder="Your email"
                  />
                </div>

                <div>
                  <Button onClick={() => subscribe({ EMAIL: email })} disabled={!!status}>
                    {message ? (
                      <div dangerouslySetInnerHTML={{ __html: message.toString() }} />
                    ) : (
                      'Subscribe'
                    )}
                  </Button>
                </div>
              </div>
            )}
          />
        </Section>

        <div className="flex justify-center w-full px-4 py-4 sm:px-10">
          <div className="flex items-center w-full max-w-3xl text-gray-600">
            <div>© 2022 Agnosis</div>
            <div className="flex-1"></div>
            <a href="https://twitter.com/0xAgnosis" className="flex">
              <img
                className="mr-2"
                src="data:image/svg+xml;charset=utf-8;base64,PHN2ZyB4bWxucz0naHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmcnIHdpZHRoPScxNicgaGVpZ2h0PScxNCcgdmlld0JveD0nMCAwIDE2IDE0Jz48ZyBmaWxsPSdub25lJyBmaWxsLXJ1bGU9J2V2ZW5vZGQnPjxwYXRoIGQ9J00tMi0zaDIwdjIwSC0yeicvPjxwYXRoIGZpbGw9JyM2NzYzNzAnIGZpbGwtcnVsZT0nbm9uemVybycgZD0nTTE1Ljc3OCAxLjkxOWMtLjU1Mi4yOC0xLjE5Ny40NjYtMS44NDEuNDY2LjY0NC0uMzczIDEuMTk2LTEuMDI2IDEuMzgtMS43NzItLjY0NC4zNzMtMS4yODguNjUzLTIuMDI0Ljc0NkMxMi43NC43MDYgMTEuOTEyLjMzMyAxMC45OS4zMzNjLTEuNzQ3IDAtMy4yMiAxLjQ5Mi0zLjIyIDMuMjY0IDAgLjI4IDAgLjQ2Ny4wOTIuNzQ2QzUuMTkyIDQuMjUgMi43OTkgMi45NDUgMS4yMzUuOTg2YTMuMjUyIDMuMjUyIDAgMCAwLS40NiAxLjY3OWMwIDEuMTE5LjU1MiAyLjE0NSAxLjQ3MiAyLjcwNC0uNTUyIDAtMS4wMTItLjE4Ni0xLjQ3My0uMzczIDAgMS41ODYgMS4xMDUgMi44OTEgMi41NzggMy4xNzEtLjI3Ni4wOTMtLjU1My4wOTMtLjgyOS4wOTMtLjE4NCAwLS4zNjggMC0uNjQ0LS4wOTMuMzY4IDEuMzA2IDEuNTY1IDIuMjM4IDMuMDM4IDIuMjM4LTEuMTA1Ljg0LTIuNDg2IDEuNC0zLjk1OCAxLjRILjIyMmE4Ljg2NiA4Ljg2NiAwIDAgMCA0Ljg3OSAxLjQ5MWM1Ljg5IDAgOS4xMTItNC45NDIgOS4xMTItOS4yMzJ2LS40NjdjLjU1Mi0uMzczIDEuMTA1LTEuMDI1IDEuNTY1LTEuNjc4eicvPjwvZz48L3N2Zz4="
              />
              Follow us on Twitter
            </a>
            <div className="flex-1 hidden sm:block"></div>
            <a className="hidden sm:block" href="mailto: info@agnosis.io">
              info@agnosis.io
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Home;
