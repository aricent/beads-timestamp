from merkletools import MerkleTools
import sqlite3, json, hashlib, calendar, time, sys
reload(sys)
sys.setdefaultencoding('utf8')

try:
  with open('./config.json') as json_file:
    data = json.load(json_file)
except Exception as e:
  status = { "status":"failure" }
  status = json.dumps(status)
  print status

SQLITE_CONN = sqlite3.connect(data["connectionURL"])
SQLITE_CONN.text_factory = str
cursor_exec = SQLITE_CONN.cursor()

mt = MerkleTools()

def create_tree(transactions):
    completeProofObject = []
    mt.add_leaf(transactions)
    mt.make_tree()
    for index in range(len(transactions)):
        completeProofObject.append(mt.get_proof(index))
    status = { "root": mt.get_merkle_root(), "proof_obj": json.dumps(completeProofObject), "transactions": transactions }
    return json.dumps(status)

def sha256sum(filename):
    h  = hashlib.sha256()
    b  = bytearray(128*1024)
    mv = memoryview(b)
    with open(filename, 'rb', buffering=0) as f:
        for n in iter(lambda : f.readinto(mv), 0):
            h.update(mv[:n])
    return h.hexdigest()


if __name__ == "__main__":
        file_name=sys.argv[1]
        file_name_org=sys.argv[2]
        all_commited_hashes = []      
        
        #Get genesis or previous merkle root if any
        fetch_last_root = "SELECT ROOT_HASH FROM MERKLEDB ORDER BY ID DESC LIMIT 1"
        cursor_exec.execute(fetch_last_root)
        file_last_root = cursor_exec.fetchall()
        all_commited_hashes.append(file_last_root[0][0])

        fetch_last_toggle = "SELECT STATUS FROM MERKLETOGGLE ORDER BY ID DESC LIMIT 1"
        cursor_exec.execute(fetch_last_toggle)
        file_last_toogle = cursor_exec.fetchall()
        file_last_toogle = file_last_toogle[0][0]

        fetch_file_hashes = "SELECT FILE_HASH FROM INDEXDB WHERE ID >= " + file_last_toogle

        cursor_exec.execute(fetch_file_hashes)
        file_hashes = cursor_exec.fetchall()
        for each_file_hashes in file_hashes:
            #all_commited_hashes.append(hashlib.sha256(each_file_hashes[0]).digest().encode('hex'))
            all_commited_hashes.append(each_file_hashes[0])

        #hash the file contents first
        hash_current_file = sha256sum("./uploads/" + file_name_org)
        if len(file_name) != 0:
            hash_current_file = hashlib.sha256(file_name).digest().encode('hex') + hash_current_file
            hash_current_file = hashlib.sha256(hash_current_file).digest().encode('hex')
        
        #hash_current_file = hashlib.sha256(file_name).digest().encode('hex') #Org Line Not needed
        all_commited_hashes.append(hash_current_file)
        #generate merkle tree
        tree = create_tree(all_commited_hashes)
        tree = json.loads(tree)
        proof_obj = json.loads(tree["proof_obj"])
        #generate_hash = generate_hash[file_name]

        
        fetch_count = "SELECT COUNT(*) FROM INDEXDB"
        cursor_exec.execute(fetch_count)
        count = cursor_exec.fetchall()
        count = int(count[0][0]) + 1

        ts = calendar.timegm(time.gmtime())
        #[ID] INTEGER NOT NULL PRIMARY KEY, [FILE_NAME] text, [FILE_HASH] text , [CURRENT_ROOT] text, [CURRENT_TREE] text, [TIMESTAMP] text
        #[TRANSACTIONS] text
        all_commited_hashes = ','.join(all_commited_hashes)
        insert_string = "INSERT INTO `INDEXDB` VALUES('" + str(count) + "','" + file_name_org + "','" + hash_current_file + "','" + tree["root"] + "','" + json.dumps(proof_obj) + "','" + str(ts) + "','" + all_commited_hashes + "')"  
        cursor_exec.execute(insert_string)
        SQLITE_CONN.commit()
        status = { "status":"success", "root": tree["root"], "filehash": hash_current_file, "proof_obj": proof_obj,  "transactions": all_commited_hashes }
        write_to_file = open("compiled.json","w+")
        status = json.dumps(status)
        write_to_file.write(status)
        print status
