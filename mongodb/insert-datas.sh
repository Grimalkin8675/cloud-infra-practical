#!/bin/bash

waitReplica () {
    code=1
    while [[ $code -ne 0 ]]; do
        echo "querying replica $1"
        echo "db" | mongo $1/$MONGO_INITDB_DATABASE --quiet > /dev/null 2> /dev/null
        code=$?
        echo "code = $code"
        if [[ $code -ne 0 ]]; then
            sleep 1
        fi
    done
}

waitReplica mongodb1
waitReplica mongodb2
waitReplica mongoArbiter
echo "all replicas are up"

echo "initiating replica set:"
echo "rs.initiate({
      _id: \"replicaTp\",
      members: [
         { _id: 0, host: \"mongodb1\" },
         { _id: 1, host: \"mongodb2\" },
         { _id: 2, host: \"mongoArbiter\", arbiterOnly:true }]});" | mongo mongodb1/$MONGO_INITDB_DATABASE --quiet
echo "replica set initiated"

echo "waiting for a primary"
name="null"
while [[ "$name" == "null" ]]; do
    name=$(echo "const primary = rs.status().members.find(function (e) { return e.stateStr === \"PRIMARY\"; }); primary!==undefined?primary.name:null" | mongo mongodb1/$MONGO_INITDB_DATABASE --quiet)
    echo "name = $name"
    if [[ "$name" == "null" ]]; then
        sleep 1
    fi
done
echo "primary found"

echo "waiting for primary to be master"
ismaster="false"
while [[ "$ismaster" == "false" ]]; do
    ismaster=$(echo "rs.isMaster().ismaster" | mongo $name/$MONGO_INITDB_DATABASE --quiet)
    echo "ismaster = $ismaster"
    if [[ "$ismaster" == "false" ]]; then
        sleep 1
    fi
done
echo "primary is now master"

echo "droping database: $MONGO_INITDB_DATABASE"
echo "db.runCommand({ dropDatabase: 1 })" | mongo $name/$MONGO_INITDB_DATABASE --quiet

echo "inserting datas"
mongo $name/$MONGO_INITDB_DATABASE /mongodb/datas/*.js --quiet
