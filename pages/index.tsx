import { useState, useEffect } from 'react';
import Head from 'next/head';
import Image from 'next/legacy/image';
import styles from '../styles/Home.module.css';
import axios from "axios";

interface Card {
  id: string;
  name: string;
  cores: { core: { serial: string } }[];
  date_utc: string;
  success: boolean;
  failures: { reason: string }[];
  payloads: { id: string, type: string }[];
  links: {
    patch: {
      small: string;
    };
  };
}

export default function Home() {

  const [launches, setLaunches] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios.post('https://api.spacexdata.com/v4/launches/query', {
      "query": {},
      "options": {
        "populate": [
          { "path": "cores", "populate": { "path": "core" } },
          { "path": "payloads" }
        ],
        "limit": 10
      },
    })
      .then(function (response) {
        if (response.status === 200) {
          setLoading(false);
          setLaunches(response.data.docs);
        }
      })
      .catch(function (error) {
        console.log(error);
      });

  }, [setLaunches]);

  const convertDate = (dateUtc: string) => {
    const date = new Date(dateUtc);
    const formattedDate = date.toLocaleDateString('en-US');
    return formattedDate;
  }

  return (
    <div className={styles.container}>
      <Head>
        <title>SpaceX Launches</title>
        <meta name="description" content="Generated by create next app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className={styles.main}>
        <p className={styles.title}>SpaceX Launches</p>
        {
          !loading && (
            <div className={styles.grid}>
              {launches.map((card: Card) => {
                return (
                  <div key={card.id} className={styles.card}>
                    <h2>{card.name}</h2>
                    <div>
                      <Image
                        src={card.links.patch.small}
                        className={styles.logo}
                        alt={`Image of ${card.name}`}
                        layout="responsive"
                        width={1}
                        height={1}
                        priority={true}
                      />
                    </div>
                    <div className={styles.cardBody}>
                      <p><strong>Core:</strong> {card.cores[0].core.serial}</p>
                      <p><strong>Launch date:</strong> {convertDate(card.date_utc)}</p>
                      <p><strong>Outcome:</strong> {card.success ? <span className={styles.success}>Success</span> : <span className={styles.failure}>Failure</span>}</p>
                      <p><strong>Payloads:</strong></p>
                      {
                        card.payloads.map((payload, i) => {
                          return (
                            <div key={payload.id}>
                              <p className={styles.small}>Id: <span>{payload.id}</span></p>
                              <p className={styles.small}>Type: {payload.type}</p>
                            </div>
                          )
                        })
                      }
                      {
                        !card.success && card.failures.length > 0 && (
                          <p><strong>Reason:</strong> {card.failures[0].reason}</p>
                        )
                      }
                    </div>
                  </div>
                )
              })}
            </div>
          )
        }
      </main>
    </div>
  );
}
