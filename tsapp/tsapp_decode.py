from merkletools import MerkleTools
import hashlib, json, sqlite3, sys
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

def verify_file(proof_obj, file_hash, root):
    return mt.validate_proof(proof_obj, file_hash, root)

def sha256sum(filename):
    h  = hashlib.sha256()
    b  = bytearray(128*1024)
    mv = memoryview(b)
    with open(filename, 'rb', buffering=0) as f:
        for n in iter(lambda : f.readinto(mv), 0):
            h.update(mv[:n])
    return h.hexdigest()


if __name__ == "__main__":
        is_file_found = 0
        try:
	    file_name=sys.argv[1]
	    file_name_org=sys.argv[2]
            txid = sys.argv[3]
            fetch_file_hashes = "SELECT ROOT_TREE, TRANSACTIONS, ROOT_HASH FROM COMMITDB ORDER BY ID DESC LIMIT 1"
            cursor_exec.execute(fetch_file_hashes)
            file_hashes = cursor_exec.fetchall()
            proof_obj = json.loads(file_hashes[0][0])
            fetch_tx = "SELECT TRANSACTIONS FROM COMMITDB ORDER BY ID DESC LIMIT 1"
            cursor_exec.execute(fetch_tx)
            file_tx = cursor_exec.fetchall()
            tx_list = file_tx[0][0].split(",")
            fetch_root = "SELECT ROOT_HASH FROM COMMITDB WHERE PUBLIC_TXID='" + txid + "' ORDER BY ID DESC LIMIT 1"
            cursor_exec.execute(fetch_root)
            file_root = cursor_exec.fetchall()
            root = file_root[0][0]

            #hash the file contents first
            hash_current_file = sha256sum("./verify/" + file_name_org)
            if len(file_name) != 0:
                hash_current_file = hashlib.sha256(file_name).digest().encode('hex') + hash_current_file
                hash_current_file = hashlib.sha256(hash_current_file).digest().encode('hex')
            #hash_current_file = hashlib.sha256(file_name).digest().encode('hex')#Org line not needed now
            for index in range(len(tx_list)):
                if index == 0:
                    continue
                #index = index + 1 #For first root is genesis, after merkle root of previous hash
                #if len(tx_list) == index:
                    #break;
                if tx_list[index] == hash_current_file:
                    status = verify_file(proof_obj[index], hash_current_file, root)
                    if status == True:
                        is_file_found = 1
                        status = { "status":"success", "file_hash": hash_current_file, "root": root }
                        status = json.dumps(status)
                        print status
                        break;

            if is_file_found == 0:
                status = { "status":"failure"}
                status = json.dumps(status)
                print status

        except Exception as e:
            status = { "status":"failure"}
            status = json.dumps(status)
            print status


        '''        
	last_tree = json.loads(file_hashes[0][0])
        last_tree = json.loads(last_tree)
	file_hash = hashlib.sha256(file_name).hexdigest()
        try:
            file_hash_commited = last_tree[file_name]
            if file_hash_commited == file_hash:
                status = { "status":"success" }
                status = json.dumps(status)
                print status
        except Exception as e:
            status = { "status":"failure" }
            status = json.dumps(status)
            print status
        '''
