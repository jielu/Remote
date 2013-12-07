package edu.gatech.se.remotedebugging.recording;

import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStreamReader;
import java.net.UnknownHostException;

import javax.servlet.ServletException;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import com.mongodb.BasicDBObject;
import com.mongodb.DB;
import com.mongodb.DBCollection;
import com.mongodb.DBObject;
import com.mongodb.MongoClient;
import com.mongodb.util.JSON;

public class RecordingUpdaterServlet extends HttpServlet {
	 private MongoClient mongoClient = null;
	 private DB db = null;
	 private DBCollection connection = null;

	/**
	 * 
	 */
	private static final long serialVersionUID = 1L;
	
	public void init() throws ServletException {
		try {
			mongoClient = new MongoClient();
			db = mongoClient.getDB("remotedebugging");
			connection = db.getCollection("recordings");
		} catch (UnknownHostException e) {
			e.printStackTrace();
		}
	}

	@Override
	protected void doGet(HttpServletRequest req, HttpServletResponse resp)
			throws ServletException, IOException {
		String targetMachine = req.getParameter("targetMachine");
		String logId = req.getParameter("logId");
		String withException = req.getParameter("withException");
		String codeVersion = req.getParameter("codeVersion");
		
		BasicDBObject doc = new BasicDBObject("targetMachine", targetMachine).
                append("logId", logId).
                append("withException", withException).
                append("codeVersion", codeVersion);
		

		//connection.insert(doc);
		
		
	}

}
