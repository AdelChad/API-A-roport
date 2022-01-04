<?php

class Airports {

	// table
	private $db;
    private $table = "airports";

    // object properties
    public $id;
    public $name;
    public $latitude;
    public $longitude;

    /**
     * Constructor with $db
     *
     * @param $db
     */
    public function __construct($db){
        $this->db = $db;
    }


    /**
     * Create user
     *
     * @return boolean
     */
	public function create ($data) {
        $sql = 'INSERT INTO airports(name, latitude, longitude) VALUES(:name, :latitude, :longitude)';
        $query = $this->db->prepare($sql);
        $query->bindValue(':name', $data->name);
        $query->bindValue(':latitude', $data->latitude);
        $query->bindValue(':longitude', $data->longitude);

        $query->execute();
	}

    /**
     * Read all users
     *
     * @return array
     */
	public function read() {
		
        $sql = 'SELECT * from airports';
        $query = $this->db->query($sql);

        $jsonArray = array();

        while($row = $query->fetchArray(SQLITE3_ASSOC)){
            $jsonArray[] = $row;
        }

        return $jsonArray;
	}

    /**
     * Update user
     *
     * @return boolean
     */
	public function update($data) {
        $sql = "UPDATE airports SET name = :name, latitude = :latitude, longitude = :longitude WHERE id = :id";
        $query = $this->db->prepare($sql);
        $query->bindValue(':id', $data->id);
        $query->bindValue(':name', $data->name);
        $query->bindValue(':latitude', $data->latitude);
        $query->bindValue(':longitude', $data->longitude);

        $query->execute();
	}

    /**
     * Delete user
     *
     * @return boolean
     */
	public function delete ($data) {
        $sql = "DELETE FROM airports WHERE id = :id";
        $query = $this->db->prepare($sql);
        $query->bindValue(':id', $data->id);

        $query->execute();
	}
}

?>
