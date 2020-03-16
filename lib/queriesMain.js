exports.getBPEL = ['SELECT measurement_type, measurement_value, date_signature FROM Pe_Records WHERE user_id = "', '" AND measurement_type = "BPEL" ORDER BY date_signature DESC;'];
exports.getBPFL = ['SELECT measurement_type, measurement_value, date_signature FROM Pe_Records WHERE user_id = "', '" AND measurement_type = "BPFL" ORDER BY date_signature DESC;'];
exports.getBPFSL = ['SELECT measurement_type, measurement_value, date_signature FROM Pe_Records WHERE user_id = "', '" AND measurement_type = "BPFSL" ORDER BY date_signature DESC;'];
exports.getMSEG = ['SELECT measurement_type, measurement_value, date_signature FROM Pe_Records WHERE user_id = "', '" AND measurement_type = "MSEG" ORDER BY date_signature DESC;'];
exports.getMSFG = ['SELECT measurement_type, measurement_value, date_signature FROM Pe_Records WHERE user_id = "', '" AND measurement_type = "MSFG" ORDER BY date_signature DESC;'];
exports.getBSEG = ['SELECT measurement_type, measurement_value, date_signature FROM Pe_Records WHERE user_id = "', '" AND measurement_type = "BSEG" ORDER BY date_signature DESC;'];
exports.getBSFG = ['SELECT measurement_type, measurement_value, date_signature FROM Pe_Records WHERE user_id = "', '" AND measurement_type = "BSFG" ORDER BY date_signature DESC;'];
exports.getGoal = ['SELECT * FROM Pe_Goals WHERE user_id = "', '"'];

exports.addRecord = ['INSERT INTO Pe_Records (user_id, measurement_type, measurement_value, date_signature) VALUES (', ', "', '", ', ', ', ')'];