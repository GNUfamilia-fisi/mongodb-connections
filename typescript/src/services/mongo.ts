import { Db, MongoClient } from 'mongodb';

const { MONGO_URI } = process.env;
const { DB_NAME } = process.env;

async function connectToDatabase(): Promise<Db> {
  if (!MONGO_URI || !DB_NAME) {
    throw new Error('Please define the appropiate environment variable inside .env');
  }
  const client = new MongoClient(MONGO_URI);
  await client.connect();

  process.on('exit', () => {
    client.close();
  });

  console.log('Sucesfully connected to MongoDB 🍃\n');
  console.log('Databases:');
  const dbs = await client.db().admin().listDatabases();

  const exist_db = dbs.databases.some(({ name: dbname }) => {
    const found = dbname === DB_NAME;
    console.log(` - ${dbname}` + (found ? ' (found db 🐢)' : ''));
    return found;
  });

  console.log()

  if (!exist_db) {
    throw new Error(`Couldn't found the '${DB_NAME}' database`);
  }

  const db = client.db(DB_NAME);
  return db;
}

const db = await connectToDatabase();

export { db };
